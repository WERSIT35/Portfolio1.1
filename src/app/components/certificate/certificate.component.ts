import {
  AfterViewInit,
  Component,
  Inject,
  Input,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { Certifications } from '../../interfaces/certifications';
import { ExperienceService } from '../../services/experience.service';
import { isPlatformBrowser } from '@angular/common';
import Splide from '@splidejs/splide';
import '@splidejs/splide/css';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-certificate',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './certificate.component.html',
  styleUrl: './certificate.component.scss',
})
export class CertificateComponent implements AfterViewInit, OnInit {
  @Input() certify!: Certifications;

  certificationList: Certifications[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private certificate: ExperienceService
  ) {}

  ngOnInit(): void {
    this.certificationList = this.certificate.getCertificate();
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.addEventListener('DOMContentLoaded', () => {
        new Splide('#certificate', {
          type: 'loop',
          autoplay: true,
          pagination: false,
          arrows: false,
          perPage:3,
          padding: '7.5%',
          mediaQuery: 'max',
          breakpoints: {
            1200: {
              perPage:3,
              padding: '7.5%',
            },
            768: {
              perPage:2,
              padding: '7.5%',
            },
            480: {
              perPage:1,
              padding: '7.5%',
            },
          },
        }).mount();
      });
    }
  }
}
