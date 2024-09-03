import { AfterViewInit, Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import '@splidejs/splide/css';
import Splide from '@splidejs/splide';
import { EducationService } from '../../../services/education.service';
import { Education } from '../../../interfaces/education';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SkillsComponent } from '../../skills/skills.component';
import { ExperienceComponent } from "../../experience/experience.component";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, SkillsComponent, ExperienceComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent implements AfterViewInit, OnInit{
  @Input() education!:Education;
  
  educationList:Education[]=[];
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private educationService:EducationService,
  ) {}
  
  ngOnInit(): void {
      this.educationList = this.educationService.getEducation();
  }
  ngAfterViewInit(): void {
  if (isPlatformBrowser(this.platformId)) {
    document.addEventListener('DOMContentLoaded', () => {
      var splide = new Splide('#education', {
        gap: '3.4rem',
        pagination: false,
        arrows: false,
        width: '100%',
        fixedWidth: '30%',
        padding: '7.5%',
        mediaQuery: 'max',
        breakpoints: {
          1200: {
            fixedWidth: '40%',
            padding: '7.5%',
          },
          768: {
            fixedWidth: '50%',
            padding: '7.5%',
          },
          480: {
            fixedWidth: '70%',
            gap: '1.5rem',
          }
        }
      });
      splide.mount();
    });
  }
}
}
