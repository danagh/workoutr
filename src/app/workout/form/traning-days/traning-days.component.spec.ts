import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraningDaysComponent } from './traning-days.component';

describe('TraningDaysComponent', () => {
  let component: TraningDaysComponent;
  let fixture: ComponentFixture<TraningDaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TraningDaysComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TraningDaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
