import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutFinishedComponent } from './workout-finished.component';

describe('WorkoutFinishedComponent', () => {
  let component: WorkoutFinishedComponent;
  let fixture: ComponentFixture<WorkoutFinishedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkoutFinishedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkoutFinishedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
