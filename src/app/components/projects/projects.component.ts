import { Component, OnInit } from '@angular/core';
import { BackComponent } from '../back/back.component';
import { Projects } from '../../interfaces/projects';
import { ProjectsService } from '../../services/projects.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

interface ProjectEntry {
  project: Projects;
  index: number;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [BackComponent, RouterLink, CommonModule],
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
