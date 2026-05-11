import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsService } from '../../services/projects.service';
import { RevealOnScrollDirective } from '../../directives/reveal-on-scroll.directive';

interface ImpactStat {
  value: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-impact-strip',
  standalone: true,
  imports: [CommonModule, RevealOnScrollDirective],
  templateUrl: './impact-strip.component.html',
  styleUrl: './impact-strip.component.scss',
})
export class ImpactStripComponent implements OnInit {
  stats: ImpactStat[] = [];

  constructor(private projectsService: ProjectsService) {}

  ngOnInit(): void {
    const all = this.projectsService.getProjects();
    const realProjects = all.filter((p) => !p.projName.startsWith('TODO'));
    const live = realProjects.filter((p) => p.status === 'live').length;

    this.stats = [
      { value: String(realProjects.length), label: 'Projects shipped', icon: 'bi-rocket-takeoff' },
      { value: String(live), label: 'Live deployments', icon: 'bi-globe2' },
      { value: '5+', label: 'Years coding', icon: 'bi-calendar-check' },
      { value: 'Full-stack', label: 'Angular · Node · FastAPI · AWS', icon: 'bi-layers' },
    ];
  }
}
