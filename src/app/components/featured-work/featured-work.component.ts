import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProjectsService } from '../../services/projects.service';
import { Projects } from '../../interfaces/projects';
import { getTechIcon, TechIcon } from '../../shared/tech-icons';
import { RevealOnScrollDirective } from '../../directives/reveal-on-scroll.directive';

interface FeaturedEntry {
  project: Projects;
  index: number;
}

@Component({
  selector: 'app-featured-work',
  standalone: true,
  imports: [CommonModule, RouterLink, RevealOnScrollDirective],
  templateUrl: './featured-work.component.html',
  styleUrl: './featured-work.component.scss',
})
export class FeaturedWorkComponent implements OnInit {
  hero: FeaturedEntry | null = null;
  supporting: FeaturedEntry[] = [];

  constructor(private projectsService: ProjectsService) {}

  ngOnInit(): void {
    this.projectsService.getProjects().subscribe((all) => {
      const featured = all
        .map((project, index) => ({ project, index }))
        .filter((x) => x.project.featured && !x.project.projName.startsWith('TODO'));
      this.hero = featured[0] ?? null;
      this.supporting = featured.slice(1, 4);
    });
  }

  /** Cursor-aware spotlight on hover (CSS vars). */
  onCardMove(e: MouseEvent): void {
    const t = e.currentTarget as HTMLElement | null;
    if (!t) return;
    const r = t.getBoundingClientRect();
    t.style.setProperty('--spot-x', `${((e.clientX - r.left) / r.width) * 100}%`);
    t.style.setProperty('--spot-y', `${((e.clientY - r.top) / r.height) * 100}%`);
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
}
