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
      new Splide('#certificate', {
        type: 'loop',
        start: 1,
        autoplay: true,
        pagination: false,
        arrows: false,
        drag: true,
        focus: 'center',
        trimSpace: false,
        perPage: 2,
        gap: '0.8rem',
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
          700: {
            perPage: 1,
            padding: { left: '6%', right: '6%' },
          },
          480: {
            padding: { left: '0', right: '0' },
          },
        },
      }).mount();
    }
  }
}
