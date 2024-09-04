import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplistComponent } from './explist.component';

describe('ExplistComponent', () => {
  let component: ExplistComponent;
  let fixture: ComponentFixture<ExplistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExplistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExplistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
