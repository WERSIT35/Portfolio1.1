import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PROJECTS } from '../../data/site-data';
import { GlassCard } from '../../components/shared/glass-card/glass-card';
import { BadgeChip } from '../../components/shared/badge-chip/badge-chip';
import { MetricTile } from '../../components/shared/metric-tile/metric-tile';
import { RevealOnScrollDirective } from '../../directives/reveal-on-scroll.directive';
import { projectStatusLabel } from '../../utils/project-status';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [RouterLink, GlassCard, BadgeChip, MetricTile, RevealOnScrollDirective],
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.scss',
})
export class ProjectDetail {
  private readonly sanitizer = inject(DomSanitizer);

  slug = input<string>();

  protected readonly project = computed(() => PROJECTS.find((p) => p.slug === this.slug()));

  protected readonly statusLabel = computed(() => {
    const project = this.project();
    return project ? projectStatusLabel(project.status) : '';
  });

  protected readonly galleryImages = computed(() => this.project()?.img.slice(1) ?? []);

  protected readonly safeEmbedUrl = computed<SafeResourceUrl | null>(() => {
    const url = this.project()?.demoEmbedUrl;
    return url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : null;
  });
}
