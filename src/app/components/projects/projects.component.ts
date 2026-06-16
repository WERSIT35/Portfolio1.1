import { Component, OnInit } from '@angular/core';
import { BackComponent } from '../back/back.component';
import { Projects } from '../../interfaces/projects';
import { ProjectsService } from '../../services/projects.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { getTechIcon, TechIcon } from '../../shared/tech-icons';
import { RevealOnScrollDirective } from '../../directives/reveal-on-scroll.directive';
import { TiltDirective } from '../../directives/tilt.directive';
import { SpotlightDirective } from '../../directives/spotlight.directive';
import { MastheadMotifComponent } from '../shared/masthead-motif/masthead-motif.component';

interface ProjectEntry {
  project: Projects;
  index: number;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [BackComponent, RouterLink, CommonModule, RevealOnScrollDirective, TiltDirective, SpotlightDirective, MastheadMotifComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent implements OnInit {
  lead?: ProjectEntry;
  archive: ProjectEntry[] = [];

  constructor(private projectService: ProjectsService) {}

  ngOnInit(): void {
    this.projectService.getProjects().subscribe((all) => {
      const realEntries = all
        .map((project, index) => ({ project, index }))
        .filter((e) => !e.project.projName.startsWith('TODO'));

      const featured = realEntries.filter((e) => e.project.featured);
      this.lead = featured[0] ?? realEntries[0];
      this.archive = realEntries.filter((e) => e.index !== this.lead?.index);
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
}
