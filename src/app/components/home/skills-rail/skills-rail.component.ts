import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EducationService } from '../../../services/education.service';
import { RevealOnScrollDirective } from '../../../directives/reveal-on-scroll.directive';

export interface SkillEntry {
  name: string;
  icon: string;
  color: string;
  isLead?: boolean;
}

export interface SkillLayer {
  label: string;
  sublabel: string;
  headIcon: string;
  skills: SkillEntry[];
}

@Component({
  selector: 'app-skills-rail',
  standalone: true,
  imports: [CommonModule, RevealOnScrollDirective],
  templateUrl: './skills-rail.component.html',
  styleUrl: './skills-rail.component.scss',
})
export class SkillsRailComponent implements OnInit {
  layers: SkillLayer[] = [];

  private LAYER_DEFS: { label: string; sublabel: string; headIcon: string; names: string[]; lead: string }[] = [
    {
      label: 'Interface',
      sublabel: 'Frontend',
      headIcon: 'bi-layers-half',
      lead: 'Angular',
      names: ['Angular', 'TypeScript', 'SCSS', 'RxJS', 'HTML5', 'React', 'Firebase'],
    },
    {
      label: 'API',
      sublabel: 'Backend',
      headIcon: 'bi-hdd-rack',
      lead: 'Node.js (Express)',
      names: ['Node.js (Express)', 'REST API Design', 'FastAPI', 'Java (Spring Boot)', 'C#'],
    },
    {
      label: 'Data',
      sublabel: 'Storage',
      headIcon: 'bi-database',
      lead: 'PostgreSQL',
      names: ['PostgreSQL', 'MySQL', 'MongoDB', 'Oracle'],
    },
    {
      label: 'Platform',
      sublabel: 'Infrastructure',
      headIcon: 'bi-cloud',
      lead: 'Docker',
      names: ['Docker', 'CI/CD (GitHub Actions)', 'Kubernetes', 'AWS', 'NGINX'],
    },
  ];

  constructor(private educationService: EducationService) {}

  ngOnInit(): void {
    this.educationService.getSkills().subscribe((skillsList) => {
      const s = skillsList[0];
      if (!s) return;
      this.layers = this.LAYER_DEFS.map((def) => ({
        label: def.label,
        sublabel: def.sublabel,
        headIcon: def.headIcon,
        skills: def.names
          .map((name) => {
            const i = s.name.indexOf(name);
            if (i < 0) return null;
            return {
              name: s.name[i],
              icon: s.icon[i],
              color: s.color[i],
              isLead: name === def.lead,
            } as SkillEntry;
          })
          .filter((x): x is SkillEntry => !!x),
      }));
    });
  }
}
