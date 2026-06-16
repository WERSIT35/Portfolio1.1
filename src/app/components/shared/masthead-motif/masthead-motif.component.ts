import { Component, Input } from '@angular/core';
import { SignatureComponent, MotifVariant } from '../../home/signature/signature.component';

/**
 * A page-header "signature" — drops the WebGL motif engine into the right side
 * of a masthead (desktop only; faded from the left so the title stays legible).
 * The host must be inside a `position: relative` masthead. Reuses the defensive
 * SignatureComponent (lazy GL, IO-gated, theme-reactive, reduced-motion frame).
 */
@Component({
  selector: 'app-masthead-motif',
  standalone: true,
  imports: [SignatureComponent],
  template: `<app-signature [variant]="variant"></app-signature>`,
  styleUrl: './masthead-motif.component.scss',
})
export class MastheadMotifComponent {
  @Input() variant: MotifVariant = 'sphere';
}
