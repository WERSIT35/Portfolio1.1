import { Component, DestroyRef, afterNextRender, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CONTACT, EXPERIENCES, PROJECTS } from '../../../data/site-data';
import { SpySectionDirective } from '../../../directives/spy-section.directive';

// Hero copy: fixed statements, everything else is read from site-data.
const ROLE = 'Full-Stack Engineer · Applied AI';
const CORE_STACK = ['Angular', 'React', 'Node.js', 'PostgreSQL', 'Docker', 'Claude API'];

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
  protected readonly contact = CONTACT;
  protected readonly role = ROLE;
  protected readonly stack = CORE_STACK;

  /** The running engineering role (one line in the hero; the full history lives in Experience). */
  protected readonly current = EXPERIENCES.find(
    (job) => /present/i.test(job.date) && /engineer|developer/i.test(job.role),
  )!;

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
    });
  }
}
