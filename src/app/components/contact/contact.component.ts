import { Component, OnDestroy } from '@angular/core';
import { BackComponent } from '../back/back.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RevealOnScrollDirective } from '../../directives/reveal-on-scroll.directive';

type CopyKey = 'email' | 'phone';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [BackComponent, CommonModule, RouterLink, RevealOnScrollDirective],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnDestroy {
  readonly EMAIL = 'otowork3@gmail.com';
  readonly PHONE = '+995557282616';

  copiedKey: CopyKey | null = null;
  copyAnnouncement = '';

  private resetTimer: ReturnType<typeof setTimeout> | null = null;

  async copy(key: CopyKey, value: string, label: string): Promise<void> {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(value);
      this.copiedKey = key;
      this.copyAnnouncement = `${label} copied to clipboard`;
      if (this.resetTimer) clearTimeout(this.resetTimer);
      this.resetTimer = setTimeout(() => {
        this.copiedKey = null;
        this.copyAnnouncement = '';
        this.resetTimer = null;
      }, 1800);
    } catch {
      /* clipboard blocked (insecure context / permissions) — silent no-op */
    }
  }

  ngOnDestroy(): void {
    if (this.resetTimer) clearTimeout(this.resetTimer);
  }
}
