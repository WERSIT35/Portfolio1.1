import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { CERTIFICATIONS, EDUCATION_ITEMS } from '../../../data/site-data';
import { SpySectionDirective } from '../../../directives/spy-section.directive';

// Playhead trails the pointer (lerp per 60fps frame, dt-normalised).
const PLAYHEAD_FOLLOW = 0.12;
// Scrub scoring: how much being off the pointer's row counts against a track, in years.
const ROW_WEIGHT_YEARS = 0.6;
// Fading dashed lead-in before an "expected" marker. Purely visual — the data has no start year.
const LEAD_IN_YEARS = 0.9;

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const pad = (n: number) => String(n).padStart(2, '0');

/** "Aug 14, 2023" → 2023.62; a bare "2024" sits mid-year since the month isn't known. */
function yearValue(issued: string): number {
  const year = Number(issued.match(/\d{4}/)?.[0]);
  const month = MONTHS.indexOf(issued.slice(0, 3).toLowerCase());
  if (month < 0) return year + 0.5;
  const day = Number(issued.match(/\b(\d{1,2}),/)?.[1] ?? 1);
  return year + (month + (day - 1) / 31) / 12;
}

/** "University of Georgia" → "UG", "FreeCodeCamp" → "FCC". */
function monogram(name: string): string {
  const words = name.split(/\s+/).filter((w) => /^[A-Z]/.test(w));
  return words.length > 1 ? words.map((w) => w[0]).join('') : name.replace(/[^A-Z]/g, '');
}

interface Tick {
  at: number;
  year: number;
  label: string;
}

type Geometry =
  | { kind: 'span'; from: number; to: number }
  | { kind: 'expected'; at: number }
  | { kind: 'ticks'; ticks: Tick[] };

const RAW = EDUCATION_ITEMS.map((item) => {
  const span = item.date.match(/^(\d{4})\s*[-–—]\s*(\d{4})$/);
  const expected = item.date.match(/expected\s+(\d{4})/i);
  let geometry: Geometry;

  if (span) {
    geometry = { kind: 'span', from: +span[1], to: +span[2] };
  } else if (expected) {
    geometry = { kind: 'expected', at: +expected[1] };
  } else {
    // Ongoing programmes: plot the real issue dates of that issuer's certificates.
    const issuer = item.name.toLowerCase();
    const ticks = CERTIFICATIONS.filter((c) => c.issuer.toLowerCase().startsWith(issuer))
      .map((c) => ({ at: yearValue(c.issued), year: yearValue(c.issued), label: c.imageName[0] ?? c.name }))
      .sort((a, b) => a.at - b.at);
    geometry = { kind: 'ticks', ticks };
  }
  return { item, geometry };
});

const years = RAW.flatMap(({ geometry: g }) =>
  g.kind === 'span' ? [g.from, g.to] : g.kind === 'expected' ? [g.at] : g.ticks.map((t) => Math.floor(t.year)),
);
const START = Math.min(...years);
const END = Math.max(...years) + 1;
const frac = (year: number) => clamp((year - START) / (END - START), 0, 1);

@Component({
  selector: 'app-education-section',
  standalone: true,
  imports: [SpySectionDirective],
  templateUrl: './education-section.html',
  styleUrl: './education-section.scss',
})
export class EducationSection {
  protected readonly axis = Array.from({ length: END - START }, (_, i) => ({
    year: START + i,
    at: frac(START + i),
  }));
  protected readonly startYear = START;
  protected readonly endYear = END - 1;

  protected readonly tracks = RAW.map(({ item, geometry: g }, i) => {
    const [level] = item.degree.split(' — ');
    const tag = level.replace(item.title, '').trim() || level;
    const status = /in progress/i.test(item.degree) ? 'In progress' : null;
    const ticks = g.kind === 'ticks' ? g.ticks.map((t) => ({ ...t, at: frac(t.at) })) : [];
    // Where the playhead rests for this track, and the years it "covers" when scrubbing.
    const extent =
      g.kind === 'span'
        ? { from: g.from, to: g.to, anchor: (g.from + g.to) / 2 }
        : g.kind === 'expected'
          ? { from: g.at, to: g.at, anchor: g.at }
          : { from: g.ticks[0]?.year ?? END, to: g.ticks.at(-1)?.year ?? END, anchor: g.ticks.at(-1)?.year ?? END };

    return {
      ...item,
      index: pad(i + 1),
      tabId: `edu-tab-${item.id}`,
      mono: monogram(item.name),
      tag,
      status,
      dateLabel: item.date.replace(/\s*[-–]\s*/, ' — '),
      kind: g.kind,
      from: g.kind === 'span' ? frac(g.from) : g.kind === 'ticks' ? (ticks[0]?.at ?? 1) : frac(g.at - LEAD_IN_YEARS),
      to: g.kind === 'span' ? frac(g.to) : g.kind === 'ticks' ? 1 : frac(g.at),
      ticks,
      extent,
      anchor: frac(extent.anchor),
      points: g.kind === 'ticks' ? g.ticks.map((t) => t.year) : null,
      subjects: item.subjects.map((s, n) => ({ n: pad(n + 1), s })),
    };
  });
  protected readonly count = pad(this.tracks.length);

  protected readonly active = signal(0);
  protected readonly current = computed(() => this.tracks[this.active()]);
  /** Hovering / focusing the course list warms the still from B/W to colour. */
  protected readonly warm = signal(false);

  // Static on purpose: bound once for SSR, then the rAF loop owns --ph and the readout.
  protected readonly initialPh = this.tracks[0].anchor;
  protected readonly initialYear = Math.floor(this.tracks[0].extent.anchor);

  private readonly rail = viewChild.required<ElementRef<HTMLElement>>('rail');
  private readonly timeline = viewChild.required<ElementRef<HTMLElement>>('timeline');
  private readonly readout = viewChild.required<ElementRef<HTMLElement>>('readout');
  private readonly lanes = viewChild.required<ElementRef<HTMLElement>>('lanes');

  private ph = this.initialPh;
  private target = this.initialPh;
  private scrubbing = false;
  private frame = 0;
  private lastFrame = 0;
  private motionEnabled = false;

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      this.motionEnabled = !matchMedia('(prefers-reduced-motion: reduce)').matches;
      destroyRef.onDestroy(() => cancelAnimationFrame(this.frame));
    });
  }

  // ---------------------------------------------------------------------------
  // Selection
  // ---------------------------------------------------------------------------
  protected select(index: number, focus = false): void {
    const next = (index + this.tracks.length) % this.tracks.length;
    this.active.set(next);
    if (!this.scrubbing) this.aim(this.tracks[next].anchor);
    if (focus) this.lanes().nativeElement.querySelectorAll<HTMLElement>('[role="tab"]')[next]?.focus();
  }

  protected onTabKeydown(event: KeyboardEvent): void {
    const moves: Record<string, number> = {
      ArrowDown: this.active() + 1,
      ArrowRight: this.active() + 1,
      ArrowUp: this.active() - 1,
      ArrowLeft: this.active() - 1,
      Home: 0,
      End: this.tracks.length - 1,
    };
    const next = moves[event.key];
    if (next === undefined) return;
    event.preventDefault();
    this.select(next, true);
  }

  // ---------------------------------------------------------------------------
  // Scrubbing: the playhead follows the pointer along the rail and the track
  // nearest to it — in time first, then by row — becomes the active still.
  // ---------------------------------------------------------------------------
  protected onScrub(event: PointerEvent): void {
    // Touch scrolls the page; taps are handled by the lane buttons instead.
    if (event.pointerType !== 'mouse' && event.type === 'pointermove') return;
    const rail = this.rail().nativeElement.getBoundingClientRect();
    const vertical = this.isVertical();
    const f = vertical
      ? (event.clientY - rail.top) / rail.height
      : (event.clientX - rail.left) / rail.width;
    if (f < -0.02 || f > 1.02) return;

    this.scrubbing = true;
    const p = clamp(f, 0, 1);
    this.aim(p);

    const year = START + p * (END - START);
    const cross = vertical ? event.clientX : event.clientY;
    const rows = this.lanes().nativeElement.querySelectorAll<HTMLElement>('[role="tab"]');
    let best = this.active();
    let bestScore = Infinity;
    this.tracks.forEach((t, i) => {
      const time = t.points
        ? Math.min(...t.points.map((y) => Math.abs(y - year)))
        : year < t.extent.from
          ? t.extent.from - year
          : year > t.extent.to
            ? year - t.extent.to
            : 0;
      const box = rows[i]?.getBoundingClientRect();
      const row = box
        ? Math.abs(cross - (vertical ? box.left + box.width / 2 : box.top + box.height / 2)) /
          (vertical ? box.width : box.height)
        : 0;
      const score = time + row * ROW_WEIGHT_YEARS;
      if (score < bestScore) {
        bestScore = score;
        best = i;
      }
    });
    if (best !== this.active()) this.active.set(best);
  }

  protected onScrubEnd(): void {
    this.scrubbing = false;
    // Glide back to rest on whichever track the scrub left selected.
    this.aim(this.current().anchor);
  }

  private isVertical(): boolean {
    return getComputedStyle(this.timeline().nativeElement).getPropertyValue('--vertical').trim() === '1';
  }

  // ---------------------------------------------------------------------------
  // Playhead loop — runs only while the playhead is travelling.
  // ---------------------------------------------------------------------------
  private aim(p: number): void {
    this.target = p;
    if (!this.motionEnabled) {
      this.ph = p;
      this.render();
      return;
    }
    if (this.frame) return;
    this.lastFrame = performance.now();
    this.frame = requestAnimationFrame((t) => this.tick(t));
  }

  private tick(now: number): void {
    const k = Math.min(now - this.lastFrame, 64) / 16.667;
    this.lastFrame = now;
    this.ph += (this.target - this.ph) * (1 - Math.pow(1 - PLAYHEAD_FOLLOW, k));

    if (Math.abs(this.target - this.ph) < 0.0004) {
      this.ph = this.target;
      this.render();
      this.frame = 0;
      return;
    }
    this.render();
    this.frame = requestAnimationFrame((t) => this.tick(t));
  }

  private render(): void {
    this.timeline().nativeElement.style.setProperty('--ph', this.ph.toFixed(4));
    const year = Math.min(Math.floor(START + this.ph * (END - START)), END - 1);
    const readout = this.readout().nativeElement;
    if (readout.textContent !== String(year)) readout.textContent = String(year);
  }
}
