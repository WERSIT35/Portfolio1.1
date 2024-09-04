import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllEducationComponent } from './all-education.component';

describe('AllEducationComponent', () => {
  let component: AllEducationComponent;
  let fixture: ComponentFixture<AllEducationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllEducationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllEducationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
