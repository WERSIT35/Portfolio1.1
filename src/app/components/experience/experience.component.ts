import { AfterViewInit, Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { Experience } from '../../interfaces/experience';
import { ExperienceService } from '../../services/experience.service';
import Splide from '@splidejs/splide';
import '@splidejs/splide/css';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss',
})
export class ExperienceComponent implements AfterViewInit, OnInit {
  @Input() experience!: Experience;

  experienceList: Experience[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private experienceService: ExperienceService
  ) {}

  ngOnInit(): void {
    this.experienceList = this.experienceService.getExperienceList();
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.addEventListener('DOMContentLoaded', () => {
        new Splide('#experience', {
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
        }).mount();
      })
    }
    }

}
