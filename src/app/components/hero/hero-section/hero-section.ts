import { Component, DestroyRef, ElementRef, afterNextRender, inject, signal } from '@angular/core';
import { shotSize } from '../../../utils/project-media';
import { trackEvent } from '../../../utils/analytics';
import { RouterLink } from '@angular/router';
import { CONTACT, EXPERIENCES, PROJECTS } from '../../../data/site-data';
import { SpySectionDirective } from '../../../directives/spy-section.directive';

// Hero copy: fixed statements, everything else is read from site-data.
const ROLE = 'Full-Stack Engineer';
const CORE_STACK = ['Angular', 'React', 'Node.js', 'PostgreSQL', 'Docker', 'Claude API'];

// The edge's cursor drift: lerp per 60fps frame, range as a fraction of the viewport width
// either way (matches --drift-max in the styles), and the settle threshold in px.
const DRIFT_FOLLOW = 0.08;
const DRIFT_RANGE = 0.025;
const DRIFT_EPSILON = 0.1;

// The selected-work card: max tilt in deg, the magnetic pull in px, how far outside the card the
// pull starts (px), the lerp per 60fps frame, and the line scroll speed in px per second.
const CARD_TILT = 7;
const CARD_PULL = 8;
const CARD_REACH = 90;
const CARD_FOLLOW = 0.16;
const LINE_SPEED = 60;

const tbilisiTime = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Tbilisi',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [RouterLink, SpySectionDirective],
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.scss',
})
export class HeroSection {
  protected readonly trackEvent = trackEvent;
  private readonly host = inject(ElementRef<HTMLElement>);
  protected readonly contact = CONTACT;
  protected readonly role = ROLE;
  // One line of plain text; non-breaking spaces keep multi-word items ("Claude API") whole.
  protected readonly stackLine = CORE_STACK.map((item) => item.replace(/ /g, '\u00a0')).join(', ');

  /** The running engineering role (one line in the hero; the full history lives in Experience). */
  protected readonly current = EXPERIENCES.find(
    (job) => /present/i.test(job.date) && /engineer|developer/i.test(job.role),
  )!;

  /**
   * ["Freelance", "since 2022"]: who it's for (employer, or the employment type for independent
   * work) and the start year, so the colophon adds facts instead of repeating the role headline.
   * Joined with " · " in the colophon.
   */
  protected readonly currentParts = [
    this.current.company ?? this.current.employment,
    `since ${this.current.date.match(/\d{4}/)?.[0]}`,
  ].filter(Boolean);

  /** Honest counter: every project, and how many are live right now (computed from data). */
  protected readonly projectCount = PROJECTS.length;
  protected readonly liveCount = PROJECTS.filter((project) => project.status === 'live').length;

  /** Project 01 previews in the white card with its first desktop screenshot. */
  protected readonly featured = {
    slug: PROJECTS[0].slug,
    index: '01',
    projName: PROJECTS[0].projName,
    line: PROJECTS[0].subname.split(' — ')[0],
    thumb: PROJECTS[0].img.find((src) => !/Mob\./.test(src)) ?? '',
  };
  protected readonly featuredSize = shotSize(this.featured.thumb);
  /** The card is 112px wide: the 800w sibling is plenty (phones hide the card, so lazy). */
  protected readonly featuredSmall = this.featured.thumb.replace(/\.webp$/, '-800w.webp');

  /** Projects that are out in the world: live, or running in production. */
  protected readonly shippedCount = PROJECTS.filter(
    (project) => project.status === 'live' || project.status === 'in-production',
  ).length;

  /** Local time in Tbilisi (HH:mm). Null on the server: the time only exists in a browser. */
  protected readonly time = signal<string | null>(null);

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      let timer: ReturnType<typeof setTimeout>;
      // Ticks on each minute boundary, so the display never lags the real clock.
      const tick = () => {
        this.time.set(tbilisiTime.format(new Date()));
        timer = setTimeout(tick, 60_000 - (Date.now() % 60_000));
      };
      tick();
      destroyRef.onDestroy(() => clearTimeout(timer));

      this.followCursorWithEdge(destroyRef);
      this.animateFeatureCard(destroyRef);
    });
  }

  /**
   * The slab's edge drifts toward the cursor (±DRIFT_RANGE of the viewport, lerped), and the
   * name's inversion follows it. Mouse only, never with reduced motion; the loop runs only
   * while the edge is moving and the hero is on screen.
   */
  private followCursorWithEdge(destroyRef: DestroyRef): void {
    const canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!canHover || reduced) return;

    // Observe the host, not a template node (HMR replays rebuild template DOM).
    const el = this.host.nativeElement;
    let target = 0;
    let value = 0;
    let frame = 0;
    let last = 0;
    let visible = true;

    const step = (now: number) => {
      const k = Math.min(now - last, 64) / 16.667;
      last = now;
      value += (target - value) * (1 - Math.pow(1 - DRIFT_FOLLOW, k));
      if (Math.abs(target - value) < DRIFT_EPSILON) value = target;
      el.style.setProperty('--drift', `${value.toFixed(2)}px`);
      frame = value === target ? 0 : requestAnimationFrame(step);
    };
    const start = () => {
      if (frame || !visible) return;
      last = performance.now();
      frame = requestAnimationFrame(step);
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      target = (event.clientX / innerWidth - 0.5) * 2 * DRIFT_RANGE * innerWidth;
      start();
    };
    const onLeave = () => {
      target = 0;
      start();
    };

    el.addEventListener('pointermove', onMove, { passive: true });
    el.addEventListener('pointerleave', onLeave);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });
    io.observe(el);

    destroyRef.onDestroy(() => {
      cancelAnimationFrame(frame);
      io.disconnect();
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    });
  }

  /**
   * The selected-work card leans toward the cursor and is pulled a few px toward it once the
   * cursor comes within CARD_REACH; a soft glare follows the pointer across it. Also measures
   * how far the cut-off line must scroll on hover. Mouse only, never with reduced motion.
   */
  private animateFeatureCard(destroyRef: DestroyRef): void {
    const host = this.host.nativeElement as HTMLElement;
    const card = host.querySelector<HTMLElement>('.feature');
    if (!card) return;

    // The line scroll is useful for keyboard users too; it is measured once (the card is fixed width).
    const line = card.querySelector<HTMLElement>('.feature__line');
    const lineIn = card.querySelector<HTMLElement>('.feature__line-in');
    const measure = () => {
      if (!line || !lineIn) return;
      const shift = Math.max(0, lineIn.scrollWidth - line.clientWidth + 4);
      card.style.setProperty('--line-shift', `${shift}px`);
      card.style.setProperty('--line-ms', `${Math.round((shift / LINE_SPEED) * 1000)}ms`);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(card);
    destroyRef.onDestroy(() => ro.disconnect());

    const canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!canHover || reduced) return;

    const target = { rx: 0, ry: 0, mx: 0, my: 0 };
    const value = { ...target };
    let frame = 0;
    let last = 0;
    let tracking = false;

    const step = (now: number) => {
      const k = Math.min(now - last, 64) / 16.667;
      last = now;
      const t = 1 - Math.pow(1 - CARD_FOLLOW, k);
      let moving = false;
      for (const key of ['rx', 'ry', 'mx', 'my'] as const) {
        value[key] += (target[key] - value[key]) * t;
        if (Math.abs(target[key] - value[key]) < 0.01) value[key] = target[key];
        else moving = true;
      }
      card.style.setProperty('--rx', `${value.rx.toFixed(2)}deg`);
      card.style.setProperty('--ry', `${value.ry.toFixed(2)}deg`);
      card.style.setProperty('--mx', `${value.mx.toFixed(2)}px`);
      card.style.setProperty('--my', `${value.my.toFixed(2)}px`);
      frame = moving ? requestAnimationFrame(step) : 0;
    };
    const start = () => {
      if (frame) return;
      last = performance.now();
      frame = requestAnimationFrame(step);
    };
    const release = () => {
      // Hand the return trip to the CSS spring (a small overshoot as it settles).
      cancelAnimationFrame(frame);
      frame = 0;
      tracking = false;
      card.classList.remove('is-tracking');
      Object.assign(target, { rx: 0, ry: 0, mx: 0, my: 0 });
      Object.assign(value, target);
      for (const name of ['--rx', '--ry', '--mx', '--my']) card.style.removeProperty(name);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const r = card.getBoundingClientRect();
      // Distance from the cursor to the card's edge (0 inside it).
      const dx = Math.max(r.left - event.clientX, 0, event.clientX - r.right);
      const dy = Math.max(r.top - event.clientY, 0, event.clientY - r.bottom);
      const dist = Math.hypot(dx, dy);
      if (dist > CARD_REACH) {
        if (tracking) release();
        return;
      }
      if (!tracking) {
        tracking = true;
        card.classList.add('is-tracking');
      }
      // -1..1 from the card's centre, clamped so the pull stays gentle outside it.
      const px = Math.max(-1, Math.min(1, ((event.clientX - r.left) / r.width) * 2 - 1));
      const py = Math.max(-1, Math.min(1, ((event.clientY - r.top) / r.height) * 2 - 1));
      const inside = dist === 0;
      const strength = 1 - dist / CARD_REACH;
      target.mx = px * CARD_PULL * strength;
      target.my = py * CARD_PULL * 0.6 * strength;
      target.ry = inside ? px * CARD_TILT : 0;
      target.rx = inside ? -py * CARD_TILT * 0.8 : 0;
      card.style.setProperty('--gx', `${event.clientX - r.left}px`);
      card.style.setProperty('--gy', `${event.clientY - r.top}px`);
      start();
    };

    host.addEventListener('pointermove', onMove, { passive: true });
    host.addEventListener('pointerleave', release);
    destroyRef.onDestroy(() => {
      cancelAnimationFrame(frame);
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', release);
    });
  }
}
