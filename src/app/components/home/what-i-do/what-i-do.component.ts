import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevealOnScrollDirective } from '../../../directives/reveal-on-scroll.directive';

@Component({
  selector: 'app-what-i-do',
  standalone: true,
  imports: [CommonModule, RevealOnScrollDirective],
  templateUrl: './what-i-do.component.html',
  styleUrl: './what-i-do.component.scss',
})
export class WhatIDoComponent {
  currentStack = ['Angular', 'FastAPI', 'AWS'];
}
