import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { Experience } from '../../../interfaces/experience';
import { ExperienceService } from '../../../services/experience.service';
import { RouterLink } from '@angular/router';
import { BackComponent } from "../../back/back.component";

@Component({
  selector: 'app-all-experience',
  standalone: true,
  imports: [RouterLink, BackComponent],
  templateUrl: './all-experience.component.html',
  styleUrl: './all-experience.component.scss'
})
export class AllExperienceComponent implements OnInit{
  @Input() experience!: Experience;

  experienceList: Experience[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private experienceService: ExperienceService

  ) {}

  ngOnInit(): void {
    this.experienceList = this.experienceService.getExperienceList();
  }
}
