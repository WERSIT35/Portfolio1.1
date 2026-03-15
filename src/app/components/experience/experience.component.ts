import { AfterViewInit, Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { Experience } from '../../interfaces/experience';
import { ExperienceService } from '../../services/experience.service';
import Splide from '@splidejs/splide';
import '@splidejs/splide/css';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [RouterLink],
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
      new Splide('#experience', {
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
        }
      }).mount();
    }
  }

}
