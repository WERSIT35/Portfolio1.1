import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EducationService } from '../../../services/education.service';
import { RevealOnScrollDirective } from '../../../directives/reveal-on-scroll.directive';

export interface SkillEntry {
  name: string;
  icon: string;
  color: string;
  isLead?: boolean;
  /** confidence (1-5) — drives a small visual bar/dots */
  rating?: number;
}

export interface SkillLayer {
  label: string;
  sublabel: string;
  headIcon: string;
  blurb: string;
  lead: string;
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
  readonly active = signal(0);

  private LAYER_DEFS: { label: string; sublabel: string; headIcon: string; blurb: string; names: string[]; lead: string }[] = [
    {
      label: 'Frontend',
      sublabel: 'Interface',
      headIcon: 'bi-layers-half',
      blurb: 'Production Angular work — modular architecture, signals, lazy loading, and SCSS systems built for scale.',
      lead: 'Angular',
      names: ['Angular', 'TypeScript', 'SCSS', 'RxJS', 'HTML5', 'React', 'Firebase'],
    },
    {
      label: 'Backend',
      sublabel: 'API',
      headIcon: 'bi-hdd-rack',
      blurb: 'REST API design, secure auth flows (JWT, MFA, OAuth) and Node-first services across iGaming and product platforms.',
      lead: 'Node.js (Express)',
      names: ['Node.js (Express)', 'REST API Design', 'FastAPI', 'Java (Spring Boot)', 'C#'],
    },
    {
      label: 'Storage',
      sublabel: 'Data',
      headIcon: 'bi-database',
      blurb: 'Schema design, query tuning, and operational fluency across relational and document stores.',
      lead: 'PostgreSQL',
      names: ['PostgreSQL', 'MySQL', 'MongoDB', 'Oracle'],
    },
    {
      label: 'Infrastructure',
      sublabel: 'Platform',
      headIcon: 'bi-cloud',
      blurb: 'Containerized deployments, release pipelines, and cloud-ready topology for production traffic.',
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
        blurb: def.blurb,
        lead: def.lead,
        skills: def.names
          .map((name) => {
            const i = s.name.indexOf(name);
            if (i < 0) return null;
            return {
              name: s.name[i],
              icon: s.icon[i],
              color: s.color[i],
              isLead: name === def.lead,
              rating: s.rating?.[i],
            } as SkillEntry;
          })
          .filter((x): x is SkillEntry => !!x),
      }));
    });
  }

  select(i: number): void {
    if (i === this.active() || i < 0 || i >= this.layers.length) return;
    this.active.set(i);
  }

  onTabKey(e: KeyboardEvent, i: number): void {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      this.select((i + 1) % this.layers.length);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      this.select((i - 1 + this.layers.length) % this.layers.length);
    } else if (e.key === 'Home') {
      e.preventDefault();
      this.select(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      this.select(this.layers.length - 1);
    }
  }
}
