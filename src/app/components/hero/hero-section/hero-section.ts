import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CONTACT, EXPERIENCES, PROJECTS, SKILLS } from '../../../data/site-data';
import { CountUpDirective } from '../../../directives/count-up.directive';
import { ImgLoadedDirective } from '../../../directives/img-loaded.directive';
import { MagneticDirective } from '../../../directives/magnetic.directive';
import { SpotlightDirective } from '../../../directives/spotlight.directive';
import { SpySectionDirective } from '../../../directives/spy-section.directive';
import { groupSkills } from '../../../utils/skill-groups';

// Bento plane parallax: the whole grid leans a hair toward the cursor and drifts
// against it. Lerped like the Certifications deck tilt, but far more restrained.
const PLANE_FOLLOW = 0.08; // lerp per 60fps frame
const PLANE_TILT_DEG = 1.2;
const PLANE_DRIFT_PX = 6;
const PLANE_EPSILON = 0.0005;

// Core stack: the groups a recruiter scans for, strongest skills first.
const STACK_GROUPS = ['Frontend', 'Backend & APIs', 'Data', 'Cloud & DevOps', 'Applied AI & Security'];
const STACK_PER_GROUP = 4;
// Skills the intro pitch names; they lead their rows so the stack echoes the pitch.
const PITCH_SKILLS = ['Angular', 'Node.js (Express)', 'Fastify', 'Applied AI / Claude'];

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [
    NgOptimizedImage,
    RouterLink,
    CountUpDirective,
    ImgLoadedDirective,
    MagneticDirective,
    SpotlightDirective,
    SpySectionDirective,
  ],
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.scss',
})
export class HeroSection {
  protected readonly contact = CONTACT;
  protected readonly projectCount = PROJECTS.length;

  /** Roles still running ("… – Present"); engineering first, since it's the headline. */
  protected readonly currentRoles = EXPERIENCES.filter((role) => /present/i.test(role.date)).sort(
    (a, b) => Number(/engineer|developer/i.test(b.role)) - Number(/engineer|developer/i.test(a.role)),
  );
  protected readonly skillCount = SKILLS.name.length;

  /**
   * Per group: skills named in the pitch first, then by rating (ties keep data order).
   * Parentheticals are trimmed so each row scans as plain keywords.
   */
  protected readonly stackGroups = groupSkills(SKILLS)
    .filter((group) => STACK_GROUPS.includes(group.category))
    .map((group) => ({
      category: group.category,
      items: group.items
        .map((item, order) => ({ ...item, order, pitch: PITCH_SKILLS.includes(item.name) ? 1 : 0 }))
        .sort((x, y) => y.pitch - x.pitch || y.rating - x.rating || x.order - y.order)
        .slice(0, STACK_PER_GROUP)
        .map((item) => item.name.replace(/\s*\(.*\)/, '')),
    }));

  private readonly bento = viewChild.required<ElementRef<HTMLElement>>('bento');
  // Normalised pointer position over the hero (-1…1) and its lerped follower.
  private readonly plane = { x: 0, y: 0, tx: 0, ty: 0 };
  private frame = 0;
  private lastFrame = 0;
  private parallax = false;

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      this.parallax =
        matchMedia('(hover: hover) and (pointer: fine)').matches &&
        !matchMedia('(prefers-reduced-motion: reduce)').matches;
      destroyRef.onDestroy(() => cancelAnimationFrame(this.frame));
    });
  }

  // ---------------------------------------------------------------------------
  // Plane parallax
  // ---------------------------------------------------------------------------
  protected onPointerMove(event: PointerEvent): void {
    if (!this.parallax || event.pointerType !== 'mouse') return;
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    this.plane.tx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.plane.ty = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    this.start();
  }

  protected onPointerLeave(): void {
    this.plane.tx = 0;
    this.plane.ty = 0;
    this.start();
  }

  private start(): void {
    if (this.frame) return;
    this.lastFrame = performance.now();
    this.frame = requestAnimationFrame((t) => this.tick(t));
  }

  private tick(now: number): void {
    const k = Math.min(now - this.lastFrame, 64) / 16.667;
    this.lastFrame = now;
    const follow = 1 - Math.pow(1 - PLANE_FOLLOW, k);
    const p = this.plane;
    p.x += (p.tx - p.x) * follow;
    p.y += (p.ty - p.y) * follow;

    const settled = Math.abs(p.tx - p.x) < PLANE_EPSILON && Math.abs(p.ty - p.y) < PLANE_EPSILON;
    if (settled) {
      p.x = p.tx;
      p.y = p.ty;
    }
    const el = this.bento().nativeElement;
    if (p.x === 0 && p.y === 0) {
      el.style.transform = '';
    } else {
      el.style.transform =
        `perspective(1800px) ` +
        `translate3d(${(-p.x * PLANE_DRIFT_PX).toFixed(2)}px, ${(-p.y * PLANE_DRIFT_PX).toFixed(2)}px, 0) ` +
        `rotateX(${(-p.y * PLANE_TILT_DEG).toFixed(3)}deg) rotateY(${(p.x * PLANE_TILT_DEG).toFixed(3)}deg)`;
    }
    this.frame = settled ? 0 : requestAnimationFrame((t) => this.tick(t));
  }
}
