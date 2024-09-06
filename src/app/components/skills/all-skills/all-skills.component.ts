import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { Skills } from '../../../interfaces/skills';
import { EducationService } from '../../../services/education.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-all-skills',
  standalone: true,
  imports: [CommonModule],
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

  ngOnInit(): void {
    this.skillsList = this.educationService.getSkills();
  }
}
