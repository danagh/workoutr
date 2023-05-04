import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-traning-days',
  templateUrl: './traning-days.component.html',
  styleUrls: ['./traning-days.component.css']
})
export class TraningDaysComponent  {
  @Input()
  selectedDays: string[] = [];

  @Input()
  form: FormGroup;

  step = 0;

  constructor(private fb: FormBuilder) {

  }

  ngOnChanges(changes: SimpleChanges) {
    const selectedDays = changes['selectedDays'].currentValue as string[];
    
    this.days.clear();

    for (let i = 0; i < selectedDays.length; i++) {
      this.days.push(this.generateNewTrainingDay(selectedDays[i], i));
    }
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  traningDayAsFormGroup(traningDay: AbstractControl<any, any>) {
    return traningDay as FormGroup;
  }

  get days() {
    return this.form.get('days') as FormArray;
  }

  private generateNewTrainingDay(selectedDay: string, index: number) {
    return this.fb.group({
      name: [selectedDay],
      index: [index],
      exercises: this.fb.array([])
    });
  }
}
