import { Component, OnInit, signal } from '@angular/core';
import { Experience } from '../../interfaces/experience';
import { ExperienceService } from '../../services/experience.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RevealOnScrollDirective } from '../../directives/reveal-on-scroll.directive';
import { getTechIcon, TechIcon } from '../../shared/tech-icons';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule, RouterLink, RevealOnScrollDirective],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss',
})
export class ExperienceComponent implements OnInit {
  experienceList: Experience[] = [];
  private readonly _expanded = signal<Set<number>>(new Set([0]));

  constructor(private experienceService: ExperienceService) {}

  ngOnInit(): void {
    this.experienceService.getExperienceList().subscribe((list) => {
      this.experienceList = list;
      /* Auto-expand the first (most-recent) role for visibility on load */
      if (list.length > 0) {
        this._expanded.set(new Set([list[0].id]));
      }
    });
  }

  isExpanded(id: number): boolean {
    return this._expanded().has(id);
  }

  toggle(id: number): void {
    const next = new Set(this._expanded());
    if (next.has(id)) next.delete(id);
    else next.add(id);
    this._expanded.set(next);
  }

  techIcon(name: string): TechIcon | null {
    return getTechIcon(name);
  }
}
