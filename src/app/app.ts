import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DynamicIsland } from './components/layout/dynamic-island/dynamic-island';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DynamicIsland],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
