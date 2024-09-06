import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { Certifications } from '../../../interfaces/certifications';
import { ExperienceService } from '../../../services/experience.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-all-certificate',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './all-certificate.component.html',
  styleUrl: './all-certificate.component.scss'
})
export class AllCertificateComponent implements OnInit{
  @Input() certify!: Certifications;

  certificationList: Certifications[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private certificate: ExperienceService
  ) {}

  ngOnInit(): void {
    this.certificationList = this.certificate.getCertificate();
  }

}
