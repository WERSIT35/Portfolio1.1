import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RevealOnScrollDirective } from '../../../directives/reveal-on-scroll.directive';

@Component({
  selector: 'app-chapter',
  standalone: true,
  imports: [CommonModule, RouterLink, RevealOnScrollDirective],
  templateUrl: './chapter.component.html',
  styleUrl: './chapter.component.scss',
})
export class ChapterComponent {
  @Input() number?: string;
  @Input() title!: string;
  @Input() actionLabel?: string;
  @Input() actionLink?: string;
  @Input() id?: string;
}
