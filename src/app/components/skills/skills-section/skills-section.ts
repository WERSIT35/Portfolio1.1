import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import {
  CERTIFICATIONS,
  EDUCATION_ITEMS,
  EXPERIENCES,
  PROJECTS,
  REPOSITORIES,
  SKILLS,
} from '../../../data/site-data';
import { SpySectionDirective } from '../../../directives/spy-section.directive';
import { groupSkills } from '../../../utils/skill-groups';

// Marquee physics. Speeds in px/s; time constants in ms (≈63% of the way per τ).
const BASE_SPEED = 55;
const MAX_BOOST = 900;
const BOOST_PER_VELOCITY = 1400; // px/s of boost per px/ms of scroll velocity
const BRAKE_TAU = 160; // hover: ease to a stop in ~0.5s, like a brake
const RESUME_TAU = 450; // release / boost decay: slow, buttery recovery
const VELOCITY_DECAY_TAU = 110;
const VELOCITY_SMOOTH_TAU = 140;

// Card follow (same weighted lerp as the Projects lens).
const CARD_FOLLOW = 0.14;
const CARD_GAP_PX = 14;
const EDGE_PX = 12;

const COMPACT_QUERY = '(max-width: 767px)';
const COPIES = [0, 1, 2];

interface BandMotion {
  offset: number;
  speed: number;
  dir: 1 | -1;
  copyWidth: number;
  braking: boolean;
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

// ---------------------------------------------------------------------------
// Evidence: where each skill actually appears (project and role stacks). Matching is by
// alias — the full name, and each part around "(", ")" or "/" ("Node.js (Express)" is also
// "Node.js" and "Express") — or a prefix at a word boundary ("Angular" in "Angular SSR",
// "REST API" in "REST API Design") or before a model number ("STM32" in "STM32F767").
// No match, no evidence: nothing is invented.
// ---------------------------------------------------------------------------
const normal = (text: string) => text.toLowerCase().replace(/\s+/g, ' ').trim();
const aliases = (name: string) =>
  [
    ...new Set([
      normal(name),
      // Parts around brackets, kept whole ("CI/CD") and also split at "/".
      ...name.split(/[()]/).map(normal),
      ...name.split(/[()/]/).map(normal),
    ]),
  ].filter(Boolean);
const isPrefix = (long: string, short: string) =>
  short.length >= 3 &&
  long.startsWith(short) &&
  (long.length === short.length || /[\s.\-/]/.test(long[short.length]) || /\d/.test(short));
const matches = (skill: string, stackItem: string) => {
  const item = normal(stackItem);
  // A stack item shorter than the skill counts only if it's a phrase ("REST API" for
  // "REST API Design"); a single word ("Claude") is too generic to stand for "Claude Code".
  return aliases(skill).some(
    (a) => item === a || isPrefix(item, a) || (item.includes(' ') && isPrefix(a, item)),
  );
};
const EVIDENCE_SOURCES = [
  ...PROJECTS.map((p) => ({ name: p.projName, stack: p.stack })),
  ...EXPERIENCES.map((e) => ({ name: e.company ?? e.role, stack: e.stack })),
  ...CERTIFICATIONS.map((c) => ({ name: c.imageName[0] ?? c.name, stack: c.skills })),
  // Degree coursework (certificate paths are already covered by CERTIFICATIONS).
  ...EDUCATION_ITEMS.filter((e) => /^(BSc|MSc)\b/.test(e.degree)).map((e) => ({
    name: `${e.degree.replace(/\s*—.*$/, '')} coursework`,
    stack: e.subjects,
  })),
  // Public repositories that aren't already a project on the site.
  ...REPOSITORIES.map((r) => ({ name: `GitHub · ${r.name}`, stack: r.stack })),
];
const evidenceFor = (skill: string) =>
  EVIDENCE_SOURCES.filter((src) => src.stack.some((item) => matches(skill, item))).map(
    (src) => src.name,
  );
const ease = (dt: number, tau: number) => 1 - Math.exp(-dt / tau);

@Component({
  selector: 'app-skills-section',
  standalone: true,
  imports: [SpySectionDirective],
  templateUrl: './skills-section.html',
  styleUrl: './skills-section.scss',
})
export class SkillsSection {
  protected readonly bands = groupSkills(SKILLS).map((group, b) => ({
    ...group,
    index: String(b + 1).padStart(2, '0'),
    items: group.items.map((item) => ({
      ...item,
      glyph: item.icon.startsWith('devicon-') ? item.icon : null,
      evidence: evidenceFor(item.name),
    })),
  }));
  protected readonly total = this.bands.reduce((sum, band) => sum + band.items.length, 0);
  protected readonly copies = COPIES;
  protected readonly dots = [1, 2, 3, 4, 5];

  protected readonly hot = signal<{ band: number; item: number } | null>(null);
  protected readonly hotKey = computed(() => {
    const h = this.hot();
    return h ? `${h.band}:${h.item}` : null;
  });
  /** Last hovered skill — kept after leaving so the card fades out with its content. */
  private readonly shown = signal<{ band: number; item: number } | null>(null);
  protected readonly detail = computed(() => {
    const s = this.shown();
    if (!s) return null;
    const band = this.bands[s.band];
    return { ...band.items[s.item], category: band.category };
  });
  protected readonly cardVisible = signal(false);
  /** Keyboard: one tab stop per band (its current word); arrows move it along the band. */
  protected readonly roving = signal<number[]>(this.bands.map(() => 0));

  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly host = viewChild.required<ElementRef<HTMLElement>>('host');
  private readonly cardEl = viewChild.required<ElementRef<HTMLElement>>('card');
  private readonly tracks = viewChildren<ElementRef<HTMLElement>>('track');

  private readonly motion: BandMotion[] = this.bands.map((_, b) => ({
    offset: 0,
    speed: 0,
    dir: b % 2 === 0 ? -1 : 1,
    copyWidth: 0,
    braking: false,
  }));

  private rawVelocity = 0;
  private smoothVelocity = 0;
  private frame = 0;
  private lastFrame = 0;
  private inView = false;

  private cardTarget: HTMLElement | null = null;
  private readonly cardPos = { x: 0, y: 0 };
  private cardPlaced = false;

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      // Observers watch the component's own host element, never nodes from the template:
      // the dev server's HMR can rebuild the template DOM under a living instance, which
      // would leave observers stranded on detached nodes (the ticker then never starts).
      const hostEl = this.elementRef.nativeElement;

      // Measure one copy of each band so the offset can wrap seamlessly. measure() reads
      // the current tracks, so the host (whose size moves with every breakpoint) is enough.
      const sizes = new ResizeObserver(() => this.measure());
      sizes.observe(hostEl);
      for (const track of this.tracks()) {
        const firstCopy = track.nativeElement.firstElementChild;
        if (firstCopy) sizes.observe(firstCopy);
      }
      this.measure();

      // Scroll velocity feeds a temporary boost into every band.
      let lastY = scrollY;
      let lastT = performance.now();
      const onScroll = () => {
        const now = performance.now();
        const dt = Math.max(now - lastT, 1);
        this.rawVelocity = (scrollY - lastY) / dt;
        lastY = scrollY;
        lastT = now;
      };
      addEventListener('scroll', onScroll, { passive: true });

      // Only animate while the section is on (or near) screen.
      const visibility = new IntersectionObserver(
        ([entry]) => {
          this.inView = !!entry?.isIntersecting;
          if (this.inView) this.start();
        },
        { rootMargin: '25% 0px' },
      );
      visibility.observe(hostEl);

      // Phones: tapping outside the bands dismisses the inline detail.
      const onPointerDown = (event: PointerEvent) => {
        const target = event.target as HTMLElement;
        if (this.isCompact() && !target.closest('.band')) this.release();
      };
      document.addEventListener('pointerdown', onPointerDown);

      destroyRef.onDestroy(() => {
        sizes.disconnect();
        visibility.disconnect();
        removeEventListener('scroll', onScroll);
        document.removeEventListener('pointerdown', onPointerDown);
        cancelAnimationFrame(this.frame);
      });
    });
  }

  // ---------------------------------------------------------------------------
  // Interaction
  // ---------------------------------------------------------------------------
  protected onWordEnter(event: PointerEvent, band: number, item: number): void {
    if (event.pointerType !== 'mouse' || this.isCompact()) return;
    this.engage(band, item, event.currentTarget as HTMLElement);
  }

  protected onWordLeave(event: PointerEvent): void {
    if (event.pointerType !== 'mouse' || this.isCompact()) return;
    this.release();
  }

  protected onWordFocus(event: FocusEvent, band: number, item: number): void {
    const word = event.currentTarget as HTMLElement;
    if (!word.matches(':focus-visible')) return;
    this.revealInBand(band, word);
    this.engage(band, item, word);
  }

  protected onWordTap(band: number, item: number, event: MouseEvent): void {
    if (!this.isCompact()) return;
    const h = this.hot();
    if (h?.band === band && h.item === item) {
      this.release();
    } else {
      this.engage(band, item, event.currentTarget as HTMLElement);
    }
  }

  /** Phones: a tap on the band (not on a word) brakes it on the word nearest its centre. */
  protected onBandTap(band: number, event: MouseEvent): void {
    if (!this.isCompact() || (event.target as HTMLElement).closest('.word')) return;
    const viewport = (event.currentTarget as HTMLElement).querySelector('.band__viewport');
    if (!viewport) return;
    const vp = viewport.getBoundingClientRect();
    const centre = vp.left + vp.width / 2;
    const distance = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      return Math.abs(r.left + r.width / 2 - centre);
    };
    const words = Array.from(viewport.querySelectorAll<HTMLElement>('.word'));
    const nearest = words.reduce<HTMLElement | null>(
      (best, word) => (!best || distance(word) < distance(best) ? word : best),
      null,
    );
    if (nearest) this.engage(band, Number(nearest.dataset['item']), nearest);
  }

  /** ←/→ step along the band (Home/End jump); focus follows, so the detail follows too. */
  protected onWordKeydown(event: KeyboardEvent, band: number, item: number): void {
    const last = this.bands[band].items.length - 1;
    const moves: Record<string, number> = {
      ArrowRight: Math.min(item + 1, last),
      ArrowLeft: Math.max(item - 1, 0),
      Home: 0,
      End: last,
    };
    const next = moves[event.key];
    if (next === undefined) return;
    event.preventDefault();
    this.roving.update((r) => r.map((v, b) => (b === band ? next : v)));
    this.host()
      .nativeElement.querySelector<HTMLElement>(
        `.word[data-band="${band}"][data-item="${next}"][data-copy="0"]`,
      )
      ?.focus();
  }

  protected release(): void {
    for (const m of this.motion) m.braking = false;
    this.hot.set(null);
    this.cardVisible.set(false);
    this.cardTarget = null;
    this.start();
  }

  private engage(band: number, item: number, word: HTMLElement): void {
    this.motion.forEach((m, b) => (m.braking = b === band));
    this.hot.set({ band, item });
    this.shown.set({ band, item });
    this.cardTarget = word;
    this.cardVisible.set(true);
    this.start();
  }

  /** Keyboard focus can land on a word that's scrolled out of its band; bring it in. */
  private revealInBand(band: number, word: HTMLElement): void {
    const track = this.tracks()[band]?.nativeElement;
    const viewport = track?.parentElement;
    const m = this.motion[band];
    if (!track || !viewport || !m.copyWidth) return;

    const vp = viewport.getBoundingClientRect();
    const rect = word.getBoundingClientRect();
    if (rect.left >= vp.left && rect.right <= vp.right) return;

    m.offset += vp.left + vp.width * 0.15 - rect.left;
    this.wrap(m);
    track.style.transform = `translate3d(${m.offset.toFixed(2)}px, 0, 0)`;
  }

  // ---------------------------------------------------------------------------
  // Animation loop
  // ---------------------------------------------------------------------------
  private start(): void {
    if (this.frame || !this.inView) return;
    this.lastFrame = performance.now();
    this.frame = requestAnimationFrame((t) => this.tick(t));
  }

  private tick(now: number): void {
    const dt = Math.min(now - this.lastFrame, 64); // clamp after tab switches
    this.lastFrame = now;

    this.rawVelocity *= Math.exp(-dt / VELOCITY_DECAY_TAU);
    this.smoothVelocity += (this.rawVelocity - this.smoothVelocity) * ease(dt, VELOCITY_SMOOTH_TAU);
    const boost = Math.min(Math.abs(this.smoothVelocity) * BOOST_PER_VELOCITY, MAX_BOOST);

    const tracks = this.tracks();
    this.motion.forEach((m, b) => {
      const target = m.braking ? 0 : m.dir * (BASE_SPEED + boost);
      m.speed += (target - m.speed) * ease(dt, m.braking ? BRAKE_TAU : RESUME_TAU);
      if (!m.copyWidth) return;
      m.offset += (m.speed * dt) / 1000;
      this.wrap(m);
      const el = tracks[b]?.nativeElement;
      if (el) el.style.transform = `translate3d(${m.offset.toFixed(2)}px, 0, 0)`;
    });

    this.followCard();

    if (this.inView) {
      this.frame = requestAnimationFrame((t) => this.tick(t));
    } else {
      this.frame = 0;
    }
  }

  private wrap(m: BandMotion): void {
    if (m.offset <= -m.copyWidth) m.offset += m.copyWidth;
    if (m.offset > 0) m.offset -= m.copyWidth;
  }

  private measure(): void {
    this.tracks().forEach((track, b) => {
      const copy = track.nativeElement.firstElementChild as HTMLElement | null;
      if (!copy) return;
      // Include the gap after the copy so the seam is invisible.
      const gap = parseFloat(getComputedStyle(track.nativeElement).columnGap) || 0;
      this.motion[b].copyWidth = copy.offsetWidth + gap;
    });
  }

  /** Glass card eases toward a spot just above (or below) the hot word, following it as it brakes. */
  private followCard(): void {
    if (!this.cardTarget || this.isCompact()) {
      this.cardPlaced = false;
      return;
    }
    const bounds = this.host().nativeElement.getBoundingClientRect();
    const card = this.cardEl().nativeElement;
    const word = this.cardTarget.getBoundingClientRect();
    const w = card.offsetWidth;
    const h = card.offsetHeight;

    const x = clamp(
      word.left - bounds.left + word.width / 2 - w / 2,
      EDGE_PX,
      bounds.width - w - EDGE_PX,
    );
    const above = word.top - bounds.top - h - CARD_GAP_PX;
    const y = above >= EDGE_PX ? above : word.bottom - bounds.top + CARD_GAP_PX;

    if (!this.cardPlaced) {
      this.cardPos.x = x;
      this.cardPos.y = y;
      this.cardPlaced = true;
    }
    this.cardPos.x += (x - this.cardPos.x) * CARD_FOLLOW;
    this.cardPos.y += (y - this.cardPos.y) * CARD_FOLLOW;
    card.style.setProperty('--card-x', `${this.cardPos.x.toFixed(1)}px`);
    card.style.setProperty('--card-y', `${this.cardPos.y.toFixed(1)}px`);
  }

  private isCompact(): boolean {
    return typeof matchMedia === 'function' && matchMedia(COMPACT_QUERY).matches;
  }
}
