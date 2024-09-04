import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdulistComponent } from './edulist.component';

describe('EdulistComponent', () => {
  let component: EdulistComponent;
  let fixture: ComponentFixture<EdulistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EdulistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EdulistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
