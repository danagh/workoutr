import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishedWorkoutComponent } from './finished-workout.component';

describe('FinishedWorkoutComponent', () => {
  let component: FinishedWorkoutComponent;
  let fixture: ComponentFixture<FinishedWorkoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinishedWorkoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinishedWorkoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
