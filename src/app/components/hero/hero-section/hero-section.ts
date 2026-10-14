import { Component, DestroyRef, ElementRef, afterNextRender, inject, signal } from '@angular/core';
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
}
