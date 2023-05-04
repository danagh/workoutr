import { TestBed } from '@angular/core/testing';

import { UserWorkoutService } from './user-workout.service';

describe('UserWorkoutService', () => {
  let service: UserWorkoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserWorkoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
