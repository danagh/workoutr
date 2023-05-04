import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishedProgramComponent } from './finished-program.component';

describe('FinishedProgramComponent', () => {
  let component: FinishedProgramComponent;
  let fixture: ComponentFixture<FinishedProgramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinishedProgramComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinishedProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
