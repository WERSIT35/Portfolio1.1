import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { Education } from '../../../../interfaces/education';
import { RouterLink } from '@angular/router';
import { EducationService } from '../../../../services/education.service';
import { isPlatformBrowser } from '@angular/common';

import '@splidejs/splide/css';
import Splide from '@splidejs/splide';
import { BackComponent } from "../../../back/back.component";

@Component({
  selector: 'app-all-education',
  standalone: true,
  imports: [RouterLink, BackComponent],
  templateUrl: './all-education.component.html',
  styleUrl: './all-education.component.scss'
})
export class AllEducationComponent implements OnInit{
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
        var splide = new Splide('#alleducation', {
          gap: '3.4rem',
          width: '100%',
          mediaQuery: 'max',
          height:'60vh',
          breakpoints: {
            1200: {
            },
            768: {
            },
            480: {
            }
          }
        });
        splide.mount();
    }
  }
}
