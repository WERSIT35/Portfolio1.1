import { Component } from '@angular/core';
import { BackComponent } from "../back/back.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [BackComponent,CommonModule
    
  ],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  readonly offers = [
    {
      icon: 'bi bi-lightning-charge-fill',
      title: 'Fast MVP Delivery',
      detail: 'From idea to deployable product with clean architecture and practical iteration speed.'
    },
    {
      icon: 'bi bi-diagram-3-fill',
      title: 'Scalable Frontend Systems',
      detail: 'Angular and React codebases structured for growth, maintainability, and team collaboration.'
    },
    {
      icon: 'bi bi-speedometer2',
      title: 'Performance Tuning',
      detail: 'Bundle, render, and runtime optimization so your product feels sharp on real devices.'
    },
    {
      icon: 'bi bi-cloud-check-fill',
      title: 'Production Readiness',
      detail: 'Reliable APIs, deployment pipelines, and observability practices for stable releases.'
    }
  ];
}
