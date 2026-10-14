import { Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { CONTACT } from '../../data/site-data';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss',
})
export class NotFoundPage {
  protected readonly contact = CONTACT;

  constructor() {
    inject(Title).setTitle('Page not found — Otar Davitashvili');
    inject(Meta).updateTag({ name: 'robots', content: 'noindex' });
  }
}
