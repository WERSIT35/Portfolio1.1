import {
  AfterViewInit,
  Component,
  Inject,
  Input,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { Skills } from '../../interfaces/skills';
import { EducationService } from '../../services/education.service';
import Splide from '@splidejs/splide';
import '@splidejs/splide/css';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'], // Corrected from 'styleUrl'
})
export class SkillsComponent implements AfterViewInit, OnInit {
  @Input() skills!: Skills;

  skillsList: Skills[] = [];
  private skillsSplide?: Splide;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private educationService: EducationService
  ) {}

  ngOnInit(): void {
    this.skillsList = this.educationService.getSkills();
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.skillsSplide = new Splide('#slider1', {
        type: 'loop',
        pagination: false,
        arrows: false,
        perPage: 8,
        gap: '0.9rem',
        autoScroll: {
          pauseOnHover: true,
          pauseOnFocus: true,
          speed: 0.7,
        },
        mediaQuery: 'max',
        breakpoints: {
          1100: {
            perPage: 6,
          },
          840: {
            perPage: 5,
          },
          640: {
            perPage: 4,
          },
          460: {
            perPage: 3,
          },
        }
      }).mount({ AutoScroll });
    }
  }

  pauseSkillsSlider(): void {
    this.skillsSplide?.Components?.AutoScroll?.pause();
  }

  resumeSkillsSlider(): void {
    this.skillsSplide?.Components?.AutoScroll?.play();
  }
}
