import { Component, OnInit } from '@angular/core';
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

  constructor(private experienceService: ExperienceService) {}

  ngOnInit(): void {
    this.experienceService.getExperienceList().subscribe((list) => {
      this.experienceList = list;
    });
  }

  techIcon(name: string): TechIcon | null {
    return getTechIcon(name);
  }
}
