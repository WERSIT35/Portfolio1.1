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

// Playhead physics — semi-implicit Euler springs, one step per 60fps frame.
// Follow (tracking the pointer): K 0.16 / D 0.58 → ~2% overshoot, 90% at ~133ms.
// Snap (settling on a milestone): K 0.06 / D 0.74 → ~6% overshoot, 90% at ~183ms, rest ~0.5s.
const FOLLOW = { k: 0.16, d: 0.58 };
const SNAP = { k: 0.06, d: 0.74 };
const FRAME_MS = 1000 / 60;
// A milestone within this many years of the pointer captures the playhead.
const SNAP_RADIUS_YEARS = 0.22;
// Scrub scoring: how much being off the pointer's row counts against a track, in years.
const ROW_WEIGHT_YEARS = 0.6;
// Fading dashed lead-in before an "expected" marker. Purely visual — the data has no start year.
const LEAD_IN_YEARS = 0.9;
// The playhead counts as "on" a point-like track within this many years of it.
const HIT_YEARS = 0.18;
// Touch travel before a drag declares itself horizontal (scrub) or vertical (page scroll).
const DRAG_INTENT_PX = 8;

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

/** "Aug 14, 2023" → "Aug 2023"; "2024" stays "2024". */
function shortDate(issued: string): string {
  return issued.replace(/\s+\d{1,2},/, '');
}

/** "University of Georgia" → "UG", "FreeCodeCamp" → "FCC". */
function monogram(name: string): string {
  const words = name.split(/\s+/).filter((w) => /^[A-Z]/.test(w));
  return words.length > 1 ? words.map((w) => w[0]).join('') : name.replace(/[^A-Z]/g, '');
}

interface Milestone {
  year: number;
  label: string;
}

type Geometry =
  | { kind: 'span'; from: number; to: number }
  | { kind: 'expected'; at: number }
  | { kind: 'ticks'; ticks: Milestone[] };

const RAW = EDUCATION_ITEMS.map((item) => {
  const span = item.date.match(/^(\d{4})\s*[-–—]\s*(\d{4})$/);
  const expected = item.date.match(/expected\s+(\d{4})/i);
  let geometry: Geometry;

  if (span) {
    geometry = { kind: 'span', from: +span[1], to: +span[2] };
  } else if (expected) {
    geometry = { kind: 'expected', at: +expected[1] };
  } else {
    // Ongoing programmes: plot the real issue dates of that issuer's certificates,
    // merging certificates that share a date into one milestone.
    const issuer = item.name.toLowerCase();
    const byYear = new Map<number, string[]>();
    for (const c of CERTIFICATIONS.filter((c) => c.issuer.toLowerCase().startsWith(issuer))) {
      const year = yearValue(c.issued);
      const names = byYear.get(year) ?? [];
      names.push(`${c.imageName[0] ?? c.name} · ${shortDate(c.issued)}`);
      byYear.set(year, names);
    }
    const ticks = [...byYear]
      .map(([year, names]) => ({ year, label: names.join(' / ') }))
      .sort((a, b) => a.year - b.year);
    geometry = { kind: 'ticks', ticks };
  }
  return { item, geometry };
});

const years = RAW.flatMap(({ geometry: g }) =>
  g.kind === 'span'
    ? [g.from, g.to]
    : g.kind === 'expected'
      ? [g.at]
      : g.ticks.map((t) => Math.floor(t.year)),
);
const START = Math.min(...years);
const END = Math.max(...years) + 1;
const frac = (year: number) => clamp((year - START) / (END - START), 0, 1);
const yearAt = (p: number) => START + p * (END - START);

@Component({
  selector: 'app-education-section',
  standalone: true,
  imports: [SpySectionDirective],
  templateUrl: './education-section.html',
  styleUrl: './education-section.scss',
})
export class EducationSection {
  protected readonly axis = Array.from({ length: END - START }, (_, i) => {
    const year = START + i;
    return { year, century: String(year).slice(0, 2), short: String(year).slice(2), at: frac(year) };
  });
  protected readonly startYear = START;
  protected readonly endYear = END - 1;

  protected readonly tracks = RAW.map(({ item, geometry: g }, i) => {
    const [level] = item.degree.split(' — ');
    const tag = level.replace(item.title, '').trim() || level;
    const status = g.kind === 'span' ? 'Completed' : g.kind === 'expected' ? 'In progress' : 'Ongoing';

    // Points the playhead snaps to; the last one is where it rests for this track.
    const milestones: Milestone[] =
      g.kind === 'span'
        ? [
            { year: g.from, label: `${tag} · start · ${g.from}` },
            { year: g.to, label: `${tag} · complete · ${g.to}` },
          ]
        : g.kind === 'expected'
          ? [{ year: g.at, label: `${tag} · expected ${g.at}` }]
          : g.ticks;

    const period =
      g.kind === 'span'
        ? `${g.from} — ${g.to}`
        : g.kind === 'expected'
          ? `Expected ${g.at}`
          : `${Math.floor(g.ticks[0]?.year ?? END)} — ${item.date}`;

    return {
      ...item,
      index: pad(i + 1),
      tabId: `edu-tab-${item.id}`,
      mono: monogram(item.name),
      tag,
      status,
      period,
      caveat: g.kind === 'expected' ? 'Coursework in progress — not professional experience.' : null,
      kind: g.kind,
      from: g.kind === 'span' ? frac(g.from) : g.kind === 'ticks' ? frac(g.ticks[0]?.year ?? END) : frac(g.at - LEAD_IN_YEARS),
      to: g.kind === 'span' ? frac(g.to) : g.kind === 'ticks' ? 1 : frac(g.at),
      // Years the playhead "covers" for highlighting.
      cover: g.kind === 'span' ? { from: g.from, to: g.to } : null,
      milestones: milestones.map((m) => ({ ...m, at: frac(m.year) })),
      subjects: item.subjects.map((s, n) => ({ n: pad(n + 1), s })),
    };
  });
  protected readonly count = pad(this.tracks.length);

  /** Every milestone in chronological order, for ← → stepping. */
  private readonly timeline = this.tracks
    .flatMap((t, track) => t.milestones.map((m, index) => ({ track, index, year: m.year })))
    .sort((a, b) => a.year - b.year || a.track - b.track);

  private readonly rest = (track: number) => this.tracks[track].milestones.length - 1;

  protected readonly active = signal(0);
  protected readonly current = computed(() => this.tracks[this.active()]);
  /** Milestone the playhead is locked on, as [track, index], or null while free. */
  protected readonly snapped = signal<readonly [number, number] | null>([0, this.rest(0)]);
  protected readonly snapLabel = computed(() => {
    const s = this.snapped();
    return s ? this.tracks[s[0]].milestones[s[1]].label : null;
  });
  /** Index into `axis` of the year column under the playhead. */
  protected readonly yearIdx = signal(0);
  /** Which tracks the playhead currently crosses. */
  protected readonly hits = signal<readonly boolean[]>([]);

  private readonly rail = viewChild.required<ElementRef<HTMLElement>>('rail');
  private readonly scrubber = viewChild.required<ElementRef<HTMLElement>>('scrubber');
  private readonly lanes = viewChild.required<ElementRef<HTMLElement>>('lanes');

  // Static on purpose: bound once for SSR, then the rAF loop owns --ph and the readouts.
  protected readonly initialPh = this.tracks[0].milestones[this.rest(0)].at;
  protected readonly initialReadout = yearAt(this.initialPh).toFixed(2);

  private readonly host: HTMLElement = inject(ElementRef).nativeElement;

  private x = this.initialPh;
  private v = 0;
  private target = this.initialPh;
  private spring = SNAP;
  private dragging = false;
  /** Touch that has gone down but not yet shown a direction. */
  private pending: { id: number; x: number; y: number } | null = null;
  private frame = 0;
  private lastFrame = 0;
  private carry = 0;
  private motionEnabled = false;

  constructor() {
    const destroyRef = inject(DestroyRef);
    this.paint(this.initialPh);
    afterNextRender(() => {
      this.motionEnabled = !matchMedia('(prefers-reduced-motion: reduce)').matches;
      destroyRef.onDestroy(() => cancelAnimationFrame(this.frame));
    });
  }

  // ---------------------------------------------------------------------------
  // Selection — tabs (↑ ↓ / Home / End) pick a track, ← → step milestones in time.
  // ---------------------------------------------------------------------------
  protected select(track: number, focus = false): void {
    const next = (track + this.tracks.length) % this.tracks.length;
    this.lockOn(next, this.rest(next));
    if (focus) this.tabs()[next]?.focus();
  }

  protected onTabKeydown(event: KeyboardEvent): void {
    const tracks: Record<string, number> = {
      ArrowDown: this.active() + 1,
      ArrowUp: this.active() - 1,
      Home: 0,
      End: this.tracks.length - 1,
    };
    if (event.key in tracks) {
      event.preventDefault();
      this.select(tracks[event.key], true);
      return;
    }
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();

    const s = this.snapped();
    const year = s ? this.tracks[s[0]].milestones[s[1]].year : yearAt(this.x);
    const step =
      event.key === 'ArrowRight'
        ? this.timeline.find((m) => m.year > year + 1e-6)
        : [...this.timeline].reverse().find((m) => m.year < year - 1e-6);
    if (!step) return;
    this.lockOn(step.track, step.index);
    if (step.track !== this.active()) this.tabs()[step.track]?.focus();
  }

  private lockOn(track: number, index: number): void {
    this.active.set(track);
    this.snapped.set([track, index]);
    this.aim(this.tracks[track].milestones[index].at, SNAP);
  }

  private tabs(): HTMLElement[] {
    return [...this.lanes().nativeElement.querySelectorAll<HTMLElement>('[role="tab"]')];
  }

  // ---------------------------------------------------------------------------
  // Scrubbing — a mouse scrubs on hover, touch/pen by dragging along the rail.
  // The nearest track (in time first, then by row) becomes active; a milestone
  // of that track inside the snap radius captures the playhead with a spring.
  // ---------------------------------------------------------------------------
  protected onPointerDown(event: PointerEvent): void {
    // Touch/pen: wait to see which way the finger goes before claiming the gesture.
    if (event.pointerType === 'mouse' || !event.isPrimary) return;
    this.pending = { id: event.pointerId, x: event.clientX, y: event.clientY };
  }

  protected onPointerMove(event: PointerEvent): void {
    if (event.pointerType === 'mouse' || this.dragging) {
      this.scrub(event);
      return;
    }
    const start = this.pending;
    if (!start || event.pointerId !== start.id) return;
    const dx = Math.abs(event.clientX - start.x);
    const dy = Math.abs(event.clientY - start.y);
    if (dx < DRAG_INTENT_PX && dy < DRAG_INTENT_PX) return;
    this.pending = null;
    // Mostly vertical: a page scroll — leave it to the browser (pan-y) untouched.
    if (dy >= dx) return;

    this.dragging = true;
    try {
      this.scrubber().nativeElement.setPointerCapture(event.pointerId);
    } catch {
      // Pointer already gone (e.g. cancelled mid-gesture): scrub without capture.
    }
    this.scrub(event);
  }

  protected onPointerEnd(event: PointerEvent): void {
    // A touch that never became a horizontal drag is a tap (lane buttons handle it)
    // or a scroll the browser took over — the playhead stays put either way.
    this.pending = null;
    if (event.pointerType !== 'mouse' && !this.dragging) return;
    this.dragging = false;
    // Release: settle on the active track's milestone nearest to where the playhead
    // is heading (the spring may still be trailing the finger).
    const t = this.current();
    const year = yearAt(this.target);
    let best = 0;
    t.milestones.forEach((m, i) => {
      if (Math.abs(m.year - year) < Math.abs(t.milestones[best].year - year)) best = i;
    });
    this.lockOn(this.active(), best);
  }

  private scrub(event: PointerEvent): void {
    const rail = this.rail().nativeElement.getBoundingClientRect();
    const f = (event.clientX - rail.left) / rail.width;
    if (!this.dragging && (f < -0.02 || f > 1.02)) return;
    const p = clamp(f, 0, 1);
    const year = yearAt(p);

    const rows = this.tabs();
    let best = this.active();
    let bestScore = Infinity;
    this.tracks.forEach((t, i) => {
      const time = t.cover
        ? year < t.cover.from
          ? t.cover.from - year
          : year > t.cover.to
            ? year - t.cover.to
            : 0
        : Math.min(...t.milestones.map((m) => Math.abs(m.year - year)));
      const box = rows[i]?.getBoundingClientRect();
      // While dragging on touch the finger hides the rows — rank by time alone.
      const row = box && !this.dragging ? Math.abs(event.clientY - (box.top + box.height / 2)) / box.height : 0;
      const score = time + row * ROW_WEIGHT_YEARS;
      if (score < bestScore) {
        bestScore = score;
        best = i;
      }
    });
    if (best !== this.active()) this.active.set(best);

    const ms = this.tracks[best].milestones;
    const near = ms.findIndex((m) => Math.abs(m.year - year) <= SNAP_RADIUS_YEARS);
    if (near >= 0) {
      const s = this.snapped();
      if (!s || s[0] !== best || s[1] !== near) this.snapped.set([best, near]);
      this.aim(ms[near].at, SNAP);
    } else {
      if (this.snapped()) this.snapped.set(null);
      this.aim(p, FOLLOW);
    }
  }

  // ---------------------------------------------------------------------------
  // Playhead loop — runs only while the playhead is travelling.
  // ---------------------------------------------------------------------------
  private aim(p: number, spring: { k: number; d: number }): void {
    this.target = p;
    this.spring = spring;
    if (!this.motionEnabled) {
      this.x = p;
      this.v = 0;
      this.render();
      return;
    }
    if (this.frame) return;
    this.lastFrame = performance.now();
    this.carry = 0;
    this.frame = requestAnimationFrame((t) => this.tick(t));
  }

  private tick(now: number): void {
    // Fixed 60fps steps so the spring feels identical at 60/120Hz.
    this.carry += Math.min(now - this.lastFrame, 64);
    this.lastFrame = now;
    const { k, d } = this.spring;
    while (this.carry >= FRAME_MS) {
      this.carry -= FRAME_MS;
      this.v = (this.v + (this.target - this.x) * k) * d;
      this.x += this.v;
    }

    if (Math.abs(this.target - this.x) < 0.0003 && Math.abs(this.v) < 0.0003) {
      this.x = this.target;
      this.v = 0;
      this.render();
      this.frame = 0;
      return;
    }
    this.render();
    this.frame = requestAnimationFrame((t) => this.tick(t));
  }

  private render(): void {
    const p = clamp(this.x, 0, 1);
    this.scrubber().nativeElement.style.setProperty('--ph', p.toFixed(4));
    const text = yearAt(p).toFixed(2);
    // Queried from the host each frame: HMR can rebuild template nodes under us.
    for (const el of this.host.querySelectorAll<HTMLElement>('[data-readout]')) {
      if (el.textContent !== text) el.textContent = text;
    }
    this.paint(p);
  }

  /** Year column + track highlights; signals only change when a boundary is crossed. */
  private paint(p: number): void {
    const year = yearAt(p);
    const idx = Math.min(Math.floor(year) - START, END - START - 1);
    if (idx !== this.yearIdx()) this.yearIdx.set(idx);

    const hits = this.tracks.map((t) =>
      t.cover
        ? year >= t.cover.from - 0.02 && year <= t.cover.to + 0.02
        : t.milestones.some((m) => Math.abs(m.year - year) <= HIT_YEARS),
    );
    const prev = this.hits();
    if (hits.some((h, i) => h !== prev[i])) this.hits.set(hits);
  }
}
