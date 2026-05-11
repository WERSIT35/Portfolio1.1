import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EducationService } from '../../../services/education.service';
import { RevealOnScrollDirective } from '../../../directives/reveal-on-scroll.directive';

interface SkillItem {
  name: string;
  icon: string;
  color: string;
  rating: number;
}

interface SkillCategory {
  label: string;
  items: SkillItem[];
}

@Component({
  selector: 'app-skills-rail',
  standalone: true,
  imports: [CommonModule, RevealOnScrollDirective],
  templateUrl: './skills-rail.component.html',
  styleUrl: './skills-rail.component.scss',
})
export class SkillsRailComponent implements OnInit {
  categories: SkillCategory[] = [];

  private CATEGORIES: { label: string; names: string[] }[] = [
    {
      label: 'Frontend',
      names: ['Angular', 'React', 'TypeScript', 'JavaScript', 'RxJS', 'SCSS'],
    },
    {
      label: 'Backend',
      names: ['Node.js (Express)', 'Java (Spring Boot)', 'FastAPI', 'REST API Design'],
    },
    {
      label: 'DevOps & Cloud',
      names: ['Docker', 'Kubernetes', 'CI/CD (GitHub Actions)', 'AWS', 'NGINX'],
    },
    {
      label: 'Data',
      names: ['PostgreSQL', 'MySQL', 'MongoDB', 'Oracle'],
    },
  ];

  constructor(private educationService: EducationService) {}

  ngOnInit(): void {
    const s = this.educationService.getSkills()[0];
    if (!s) return;
    this.categories = this.CATEGORIES.map((cat) => ({
      label: cat.label,
      items: cat.names
        .map((name) => {
          const i = s.name.indexOf(name);
          if (i < 0) return null;
          return { name: s.name[i], icon: s.icon[i], color: s.color[i], rating: s.rating[i] };
        })
        .filter((x): x is SkillItem => !!x),
    }));
  }

  dots(rating: number): number[] {
    return Array.from({ length: 5 }, (_, i) => (i < rating ? 1 : 0));
  }
}
