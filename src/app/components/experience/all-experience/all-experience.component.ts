import { Component, OnInit } from '@angular/core';
import { Experience } from '../../../interfaces/experience';
import { ExperienceService } from '../../../services/experience.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BackComponent } from '../../back/back.component';
import { RevealOnScrollDirective } from '../../../directives/reveal-on-scroll.directive';

@Component({
  selector: 'app-all-experience',
  standalone: true,
  imports: [RouterLink, BackComponent, CommonModule, RevealOnScrollDirective],
  templateUrl: './all-experience.component.html',
  styleUrl: './all-experience.component.scss',
})
export class AllExperienceComponent implements OnInit {
  experienceList: Experience[] = [];

  constructor(private experienceService: ExperienceService) {}

  ngOnInit(): void {
    this.experienceList = this.experienceService.getExperienceList();
  }
}
