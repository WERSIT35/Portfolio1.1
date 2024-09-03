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

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'], // Corrected from 'styleUrl'
})
export class SkillsComponent implements AfterViewInit, OnInit {
  @Input() skills!: Skills;

  skillsList: Skills[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private educationService: EducationService
  ) {}

  ngOnInit(): void {
    this.skillsList = this.educationService.getSkills();
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.addEventListener('DOMContentLoaded', () => {
        new Splide('#slider1', {
          type: 'loop',
          pauseOnHover: true,
          pagination: false,
          arrows: false,
          perPage: 3,
          mediaQuery: 'min',
          breakpoints: {
            1200: {
              perPage:6,
            },
            768: {
              perPage:5,
            },
            480: {
              perPage:3,
            },
          }
        }).mount({ AutoScroll });
      });
    }
  }
}
