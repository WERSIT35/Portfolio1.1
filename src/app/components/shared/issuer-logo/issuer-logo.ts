import { Component, computed, input } from '@angular/core';
import { ISSUER_LOGOS } from '../../../data/issuers';
import { IssuerId } from '../../../interfaces/issuers';

// Display heights: one per context, so every issuer's mark reads at the same size.
const HEIGHT_PX = { card: 20, lg: 32 } as const;

@Component({
  selector: 'app-issuer-logo',
  standalone: true,
  templateUrl: './issuer-logo.html',
  styleUrl: './issuer-logo.scss',
})
export class IssuerLogoComponent {
  issuer = input.required<IssuerId>();
  size = input<keyof typeof HEIGHT_PX>('card');

  protected readonly logo = computed(() => ISSUER_LOGOS[this.issuer()]);
  protected readonly height = computed(() => HEIGHT_PX[this.size()]);
  // Width follows the mark's own aspect ratio; set as an attribute to avoid layout shift.
  protected readonly width = computed(() =>
    Math.round((this.height() * this.logo().width) / this.logo().height),
  );
}
