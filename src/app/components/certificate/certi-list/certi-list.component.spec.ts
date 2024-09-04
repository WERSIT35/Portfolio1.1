import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertiListComponent } from './certi-list.component';

describe('CertiListComponent', () => {
  let component: CertiListComponent;
  let fixture: ComponentFixture<CertiListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertiListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertiListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
