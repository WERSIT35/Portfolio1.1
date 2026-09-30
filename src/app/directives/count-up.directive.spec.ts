import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CountUpDirective } from './count-up.directive';

@Component({
  imports: [CountUpDirective],
  template: `<span [appCountUp]="8"></span>`,
})
class Host {}

describe('CountUpDirective', () => {
  it('renders the final value before any animation runs', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).querySelector('span')?.textContent).toBe('8');
  });
});
