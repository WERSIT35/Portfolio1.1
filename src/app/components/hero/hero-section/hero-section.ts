import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CONTACT, EXPERIENCES, PROJECTS } from '../../../data/site-data';
import { SpySectionDirective } from '../../../directives/spy-section.directive';

// Hero copy: fixed statements, everything else is read from site-data.
const ROLE = 'Full-Stack Engineer · Applied AI';
const AVAILABILITY = 'Open to freelance';
const CORE_STACK = ['Angular', 'React', 'Node.js', 'PostgreSQL', 'Docker', 'Claude API'];

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
  protected readonly availability = AVAILABILITY;
  protected readonly stack = CORE_STACK;

  /** The running engineering role (one line in the hero; the full history lives in Experience). */
  protected readonly current = EXPERIENCES.find(
    (job) => /present/i.test(job.date) && /engineer|developer/i.test(job.role),
  )!;

  /** Projects that are out in the world: live, or running in production. */
  protected readonly shippedCount = PROJECTS.filter(
    (project) => project.status === 'live' || project.status === 'in-production',
  ).length;
}
