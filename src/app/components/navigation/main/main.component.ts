import { Component, Inject, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { EducationService } from '../../../services/education.service';
import { ExperienceService } from '../../../services/experience.service';
import { ProjectsService } from '../../../services/projects.service';

import { Education } from '../../../interfaces/education';
import { Experience } from '../../../interfaces/experience';
import { Projects } from '../../../interfaces/projects';

import { RevealOnScrollDirective } from '../../../directives/reveal-on-scroll.directive';
import { SignatureComponent } from '../../home/signature/signature.component';
import { getTechIcon, TechIcon } from '../../../shared/tech-icons';

interface FeaturedEntry { project: Projects; index: number; }
interface StatTile { value: string; label: string; }
interface SkillChip { name: string; icon: string; }

/**
 * Home — a single-screen "index" bento grid.
 *
 * Replaces the old linear hero → chapter-scroll layout. Every domain (work,
 * skills, experience, education, certs, contact) is a tile in one dense grid
 * that re-flows from a 12-col desktop bento to a stacked mobile column. The
 * intro tile hosts the WebGL signature centerpiece.
 */
@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, RouterLink, RevealOnScrollDirective, SignatureComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  // Stylesheet uses a few document-level hooks (`body:has(.home--bento)`), so
  // emulated encapsulation is disabled as it was on the previous home.
  encapsulation: ViewEncapsulation.None,
})
export class MainComponent implements OnInit {
  readonly year = new Date().getFullYear();

  featured: FeaturedEntry | null = null;
  experiences: Experience[] = [];
  educationList: Education[] = [];
  skills: SkillChip[] = [];
  stats: StatTile[] = [];

  certCount = 0;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private educationService: EducationService,
    private experienceService: ExperienceService,
    private projectsService: ProjectsService,
  ) {}

  ngOnInit(): void {
    this.projectsService.getProjects().subscribe((all) => {
      const featured = all
        .map((project, index) => ({ project, index }))
        .filter((x) => x.project.featured);
      this.featured = featured[0] ?? null;

      const live = all.filter(
        (p) => p.status === 'live' || p.status === 'in-production',
      ).length;

      this.stats = [
        { value: `${all.length}`, label: 'Projects shipped' },
        { value: `${live}`, label: 'Live / in production' },
      ];
    });

    this.experienceService.getExperienceList().subscribe((list) => {
      this.experiences = list.slice(0, 2);
    });

    this.experienceService.getCertificate().subscribe((list) => {
      this.certCount = list.length;
    });

    this.educationService.getEducation().subscribe((list) => {
      this.educationList = list;
    });

    this.educationService.getSkills().subscribe((skillsList) => {
      const s = skillsList[0];
      if (!s) return;
      // Lead stack first, then fill with the highest-rated remaining skills.
      const lead = ['Angular', 'TypeScript', 'Node.js (Express)', 'RxJS', 'Docker', 'AWS'];
      const ordered = [...s.name]
        .map((name, i) => ({ name, icon: s.icon[i], rating: s.rating?.[i] ?? 0 }))
        .sort((a, b) => {
          const la = lead.indexOf(a.name);
          const lb = lead.indexOf(b.name);
          if (la !== -1 || lb !== -1) {
            return (la === -1 ? 99 : la) - (lb === -1 ? 99 : lb);
          }
          return b.rating - a.rating;
        })
        .slice(0, 10);
      this.skills = ordered.map(({ name, icon }) => ({ name, icon }));
      this.stats = [
        ...this.stats.slice(0, 2),
        { value: `${s.name.length}`, label: 'Technologies' },
      ];
    });
  }

  techIcon(name: string): TechIcon | null {
    return getTechIcon(name);
  }

  statusLabel(p: Projects): string {
    switch (p.status) {
      case 'live': return 'Live';
      case 'in-production': return 'In production';
      case 'in-development': return 'In development';
      case 'archived': return 'Archived';
      case 'private': return 'Private';
      default: return '';
    }
  }

  /* ── Cursor-aware spotlight on tiles (CSS vars) ── */
  onTileMove(e: MouseEvent): void {
    const t = e.currentTarget as HTMLElement | null;
    if (!t) return;
    const r = t.getBoundingClientRect();
    t.style.setProperty('--spot-x', `${((e.clientX - r.left) / r.width) * 100}%`);
    t.style.setProperty('--spot-y', `${((e.clientY - r.top) / r.height) * 100}%`);
  }
}
