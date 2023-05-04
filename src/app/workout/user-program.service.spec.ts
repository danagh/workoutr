import { TestBed } from '@angular/core/testing';

import { UserProgramService } from './user-program.service';

describe('UserProgramService', () => {
  let service: UserProgramService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserProgramService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
