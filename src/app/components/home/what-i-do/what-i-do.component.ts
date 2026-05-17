import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevealOnScrollDirective } from '../../../directives/reveal-on-scroll.directive';

interface Capability {
  num: string;
  icon: string;
  title: string;
  focus: string;
}

@Component({
  selector: 'app-what-i-do',
  standalone: true,
  imports: [CommonModule, RevealOnScrollDirective],
  templateUrl: './what-i-do.component.html',
  styleUrl: './what-i-do.component.scss',
})
export class WhatIDoComponent {
  currentStack = ['Angular', 'Node.js', 'Docker', 'MongoDB'];

  capabilities: Capability[] = [
    {
      num: '01',
      icon: 'bi-layers-half',
      title: 'Frontend Engineering',
      focus: 'Angular · TypeScript · RxJS · Signals · SCSS · Performance',
    },
    {
      num: '02',
      icon: 'bi-hdd-rack',
      title: 'Backend & APIs',
      focus: 'Node.js · Express · REST · JWT · PostgreSQL · MongoDB',
    },
    {
      num: '03',
      icon: 'bi-shield-check',
      title: 'Systems & Compliance',
      focus: 'Docker · CI/CD · Fraud Detection · iGaming AML · SQL Analysis',
    },
  ];
}
