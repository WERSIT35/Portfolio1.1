import { Component, ElementRef, computed, signal, viewChild } from '@angular/core';
import { CERTIFICATIONS } from '../../../data/site-data';
import { ISSUER_LOGOS } from '../../../data/issuers';
import { IssuerId } from '../../../interfaces/issuers';
import { SpySectionDirective } from '../../../directives/spy-section.directive';
import { IssuerLogoComponent } from '../../shared/issuer-logo/issuer-logo';

const yearOf = (issued: string) => Number(issued.match(/\d{4}/)?.[0] ?? 0);

// Newest first; ties keep their data order.
const CERTS = CERTIFICATIONS.map((cert, order) => ({ cert, order }))
  // Anthropic first (most relevant to the work), then newest first.
  .sort(
    (a, b) =>
      Number(/anthropic/i.test(b.cert.issuer)) - Number(/anthropic/i.test(a.cert.issuer)) ||
      yearOf(b.cert.issued) - yearOf(a.cert.issued) ||
      a.order - b.order,
  )
  .map(({ cert }, i) => ({
    id: cert.id,
    index: String(i + 1).padStart(2, '0'),
    title: cert.imageName[0] ?? cert.name,
    issuerId: cert.issuerId,
    // The brand's own spelling, whatever casing the record uses.
    issuer: cert.issuerId ? ISSUER_LOGOS[cert.issuerId].name : cert.issuer,
    issued: cert.issued,
    year: yearOf(cert.issued) || null,
    timeSpent: cert.timeSpent,
    description: cert.description,
    plate: cert.image[0],
    full: cert.image[1] ?? cert.image[0],
    // External credential page vs. a local PDF/scan.
    verifyUrl: cert.certificateUrl?.startsWith('http') ? cert.certificateUrl : null,
    pdfUrl: cert.certificateUrl?.endsWith('.pdf') ? cert.certificateUrl : null,
  }));

// The wall: one mark per issuer, most certificates first.
const ISSUERS = [...new Set(CERTS.flatMap((c) => (c.issuerId ? [c.issuerId] : [])))]
  .map((id) => ({
    id,
    name: ISSUER_LOGOS[id].name,
    count: CERTS.filter((c) => c.issuerId === id).length,
  }))
  .sort((a, b) => b.count - a.count);

@Component({
  selector: 'app-certifications-section',
  standalone: true,
  imports: [SpySectionDirective, IssuerLogoComponent],
  templateUrl: './certifications-section.html',
  styleUrl: './certifications-section.scss',
})
export class CertificationsSection {
  protected readonly certs = CERTS;
  protected readonly issuers = ISSUERS;
  protected readonly count = String(CERTS.length).padStart(2, '0');

  /** Issuer chosen on the wall (hover, focus or tap); the other issuers' rows dim. */
  protected readonly issuer = signal<IssuerId | null>(null);
  /** Row under the pointer or keyboard focus: drives the desktop preview and lights its mark. */
  protected readonly hovered = signal<number | null>(null);
  protected readonly preview = computed(
    () => CERTS.find((c) => c.id === this.hovered()) ?? CERTS[0],
  );
  /** The issuer that is lit: chosen on the wall, else the hovered row's. */
  protected readonly lit = computed(
    () => this.issuer() ?? CERTS.find((c) => c.id === this.hovered())?.issuerId ?? null,
  );

  protected readonly lightbox = signal<(typeof CERTS)[number] | null>(null);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  /** Touch / pen: a tap on a mark toggles its highlight (the mouse highlights on hover). */
  protected onMarkTap(event: MouseEvent, id: IssuerId): void {
    if ((event as PointerEvent).pointerType === 'mouse') return;
    this.issuer.update((current) => (current === id ? null : id));
  }

  /** Keyboard focus highlights too (a tap also focuses, so only :focus-visible counts). */
  protected onMarkFocus(event: FocusEvent, id: IssuerId): void {
    if ((event.target as HTMLElement).matches(':focus-visible')) this.issuer.set(id);
  }

  // Native <dialog>: Esc, focus trap, inertness and focus return for free.
  protected open(cert: (typeof CERTS)[number]): void {
    this.lightbox.set(cert);
    const dialog = this.dialog().nativeElement;
    if (!dialog.open) dialog.showModal();
  }

  protected close(): void {
    this.dialog().nativeElement.close();
  }

  protected onDialogClick(event: MouseEvent): void {
    // Clicks on the backdrop land on the <dialog> element itself.
    if (event.target === event.currentTarget) this.close();
  }
}
