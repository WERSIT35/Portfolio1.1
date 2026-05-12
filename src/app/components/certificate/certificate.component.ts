import { Component, OnInit } from '@angular/core';
import { Certifications } from '../../interfaces/certifications';
import { ExperienceService } from '../../services/experience.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RevealOnScrollDirective } from '../../directives/reveal-on-scroll.directive';

@Component({
  selector: 'app-certificate',
  standalone: true,
  imports: [CommonModule, RouterLink, RevealOnScrollDirective],
  templateUrl: './certificate.component.html',
  styleUrl: './certificate.component.scss',
})
export class CertificateComponent implements OnInit {
  certificationList: Certifications[] = [];

  constructor(private certificate: ExperienceService) {}

  ngOnInit(): void {
    this.certificate.getCertificate().subscribe((list) => {
      this.certificationList = list;
    });
  }
}
