import { AfterViewInit, Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import '@splidejs/splide/css';
import Splide from '@splidejs/splide';
import { EducationService } from '../../../services/education.service';
import { Education } from '../../../interfaces/education';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SkillsComponent } from '../../skills/skills.component';
import { ExperienceComponent } from "../../experience/experience.component";
import { RouterLink } from '@angular/router';
import { CertificateComponent } from "../../certificate/certificate.component";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, SkillsComponent, ExperienceComponent, RouterLink, CertificateComponent],
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
      const splide = new Splide('#education', {
        type: 'loop',
        start: 1,
        gap: '0.8rem',
        pagination: false,
        arrows: false,
        drag: true,
        width: '100%',
        focus: 'center',
        trimSpace: false,
        perPage: 2,
        padding: { left: '2%', right: '2%' },
        mediaQuery: 'max',
        breakpoints: {
          1100: {
            perPage: 1.7,
            padding: { left: '2%', right: '2%' },
          },
          820: {
            perPage: 1.35,
            padding: { left: '1.5%', right: '1.5%' },
          },
          720: {
            perPage: 1,
            padding: { left: '6%', right: '6%' },
          },
          480: {
            padding: { left: '0', right: '0' },
          },
        },
      });
      splide.mount();
    }
  }
}
