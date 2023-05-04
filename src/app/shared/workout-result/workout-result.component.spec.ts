import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutResultComponent } from './workout-result.component';

describe('WorkoutResultComponent', () => {
  let component: WorkoutResultComponent;
  let fixture: ComponentFixture<WorkoutResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkoutResultComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkoutResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
