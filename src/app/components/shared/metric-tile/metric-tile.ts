import { Component, input } from '@angular/core';

@Component({
  selector: 'app-metric-tile',
  standalone: true,
  templateUrl: './metric-tile.html',
  styleUrl: './metric-tile.scss',
})
export class MetricTile {
  label = input.required<string>();
  value = input.required<string>();
}
