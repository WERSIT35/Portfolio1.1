import { AfterViewInit, Component, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewEncapsulation, signal } from '@angular/core';
import { EducationService } from '../../../services/education.service';
import { Education } from '../../../interfaces/education';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ExperienceComponent } from '../../experience/experience.component';
import { RouterLink } from '@angular/router';
import { CertificateComponent } from '../../certificate/certificate.component';
import { FeaturedWorkComponent } from '../../featured-work/featured-work.component';
import { ProcessComponent } from '../../process/process.component';
import { ChapterComponent } from '../../shared/chapter/chapter.component';
import { WhatIDoComponent } from '../../home/what-i-do/what-i-do.component';
import { SkillsRailComponent } from '../../home/skills-rail/skills-rail.component';
import { RevealOnScrollDirective } from '../../../directives/reveal-on-scroll.directive';

interface NavSection { id: string; label: string; }

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ExperienceComponent,
    CertificateComponent,
    FeaturedWorkComponent,
    ProcessComponent,
    ChapterComponent,
    WhatIDoComponent,
    SkillsRailComponent,
    RevealOnScrollDirective,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  // Homepage stylesheet uses body-level hooks (`body:has(.home--ops)`) and global
  // class prefixes (`.home`, `.home--ops`, `.aur-*`) to scope its own reach.
  // Disable emulated encapsulation so those selectors hit the document.
  encapsulation: ViewEncapsulation.None,
})
export class MainComponent implements OnInit, AfterViewInit, OnDestroy {
  educationList: Education[] = [];
  readonly year = new Date().getFullYear();

  /* ── Scrollspy sidebar ───────────────────────────────────────── */
  readonly navSections: NavSection[] = [
    { id: 'top',        label: 'Hero' },
    { id: 'chapter-01', label: 'About' },
    { id: 'chapter-02', label: 'Selected Projects' },
    { id: 'chapter-03', label: 'Skills' },
    { id: 'chapter-04', label: 'Process' },
    { id: 'chapter-05', label: 'Experience' },
    { id: 'chapter-06', label: 'Education' },
    { id: 'chapter-07', label: 'Certificates' },
    { id: 'contact',    label: 'Contact' },
  ];
  readonly activeSection = signal('top');

  private observer?: IntersectionObserver;
  private rafId = 0;
  private readonly onScroll = (): void => {
    if (this.rafId) return;
    this.rafId = requestAnimationFrame(() => {
      this.rafId = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;
      doc.style.setProperty('--home-progress', `${pct}%`);
    });
  };

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private educationService: EducationService,
  ) {}

  ngOnInit(): void {
    this.educationService.getEducation().subscribe((list) => {
      this.educationList = list;
    });
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Defer one frame so chapter IDs are in the DOM after content children mount.
    queueMicrotask(() => {
      const targets = this.navSections
        .map((s) => document.getElementById(s.id))
        .filter((el): el is HTMLElement => !!el);
      if (targets.length === 0) return;

      this.observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          if (visible.length > 0) {
            this.activeSection.set(visible[0].target.id);
          }
        },
        { rootMargin: '-30% 0px -55% 0px', threshold: 0 },
      );
      for (const el of targets) this.observer.observe(el);
    });

    window.addEventListener('scroll', this.onScroll, { passive: true });
    window.addEventListener('resize', this.onScroll, { passive: true });
    this.onScroll();
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    if (this.rafId) cancelAnimationFrame(this.rafId);
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.onScroll);
      window.removeEventListener('resize', this.onScroll);
    }
  }

  scrollToSection(id: string, e?: Event): void {
    e?.preventDefault();
    if (typeof document === 'undefined') return;
    const el = document.getElementById(id);
    if (!el) return;
    const reduce = typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }

  /* ── Hero cursor spotlight ───────────────────────────────────── */
  onHeroMove(e: MouseEvent): void {
    const t = e.currentTarget as HTMLElement | null;
    if (!t) return;
    const r = t.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    t.style.setProperty('--spot-x', `${x}%`);
    t.style.setProperty('--spot-y', `${y}%`);
  }

  /* ── Magnetic CTA ────────────────────────────────────────────── */
  onMagnetMove(e: MouseEvent): void {
    const t = e.currentTarget as HTMLElement | null;
    if (!t) return;
    const r = t.getBoundingClientRect();
    const dx = ((e.clientX - r.left) / r.width - 0.5) * 20;
    const dy = ((e.clientY - r.top) / r.height - 0.5) * 20;
    t.style.setProperty('--mag-x', `${dx}px`);
    t.style.setProperty('--mag-y', `${dy}px`);
  }
  onMagnetLeave(e: MouseEvent): void {
    const t = e.currentTarget as HTMLElement | null;
    if (!t) return;
    t.style.setProperty('--mag-x', '0px');
    t.style.setProperty('--mag-y', '0px');
  }

  /* ── 3D-tilt card ────────────────────────────────────────────── */
  onTiltMove(e: MouseEvent): void {
    const t = e.currentTarget as HTMLElement | null;
    if (!t) return;
    const r = t.getBoundingClientRect();
    const rx = ((e.clientY - r.top) / r.height - 0.5) * -6;
    const ry = ((e.clientX - r.left) / r.width - 0.5) * 6;
    t.style.setProperty('--tilt-x', `${rx}deg`);
    t.style.setProperty('--tilt-y', `${ry}deg`);
    t.style.setProperty('--spot-x', `${((e.clientX - r.left) / r.width) * 100}%`);
    t.style.setProperty('--spot-y', `${((e.clientY - r.top) / r.height) * 100}%`);
  }
  onTiltLeave(e: MouseEvent): void {
    const t = e.currentTarget as HTMLElement | null;
    if (!t) return;
    t.style.setProperty('--tilt-x', '0deg');
    t.style.setProperty('--tilt-y', '0deg');
  }
}
