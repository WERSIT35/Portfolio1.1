import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { Skills } from '../../../interfaces/skills';
import { EducationService } from '../../../services/education.service';
import { CommonModule } from '@angular/common';
import { BackComponent } from "../../back/back.component";

@Component({
  selector: 'app-all-skills',
  standalone: true,
  imports: [CommonModule, BackComponent],
  templateUrl: './all-skills.component.html',
  styleUrl: './all-skills.component.scss'
})
export class AllSkillsComponent implements OnInit{
  @Input() skills!: Skills;

  skillsList: Skills[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private educationService: EducationService
  ) {}

  range(size: number): number[] {
    return Array.from({ length: size }, (_, i) => i);
  }

  ngOnInit(): void {
    this.skillsList = this.educationService.getSkills();
  }
}
