import { Component, Input } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, AbstractControl, FormControl } from '@angular/forms';
import { getErrorMessage, getWorkoutTypes } from '../../../helpers/formHelpers';
import { ImageService } from '../../image.service';

@Component({
  selector: 'app-general-information',
  templateUrl: './general-information.component.html',
  styleUrls: ['./general-information.component.css']
})
export class GeneralInformationComponent {
  @Input()
  form: FormGroup;

  daysList = ['Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag', 'Söndag'];
  levelList = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];
  typeList = getWorkoutTypes();

  constructor(private fb: FormBuilder, private imageService: ImageService) {}

  get level() {
    return this.form.get('level') as FormControl<any>;
  }

  get type() {
    return this.form.get('type') as FormControl<any>;
  }

  get days() {
    return this.form.get('days') as FormArray;
  }

  get numberOfDays() {
    return this.form.get('numberOfDays') as FormControl<any>;
  }

  handleDayClick(selectedDay: string, selectedDayIndex: number) {
    const selectedDays: string[] = this.days.value;
    const dayIsSelected = selectedDays.findIndex(day => day === selectedDay);
    if (dayIsSelected !== -1) {
      this.days.removeAt(dayIsSelected);
      this.updateNumberOfDays();
      return;
    }

    for (let i = 0; i < selectedDays.length; i++) {
      const day = selectedDays[i];
      const dayIndex = this.daysList.findIndex(d => d === day);
      if (selectedDayIndex < dayIndex) {
        this.days.insert(i, this.fb.control(selectedDay));
        this.updateNumberOfDays();
        return;
      }
    }

    this.days.push(this.fb.control(selectedDay));
    this.updateNumberOfDays();
  }

  getErrorMessage(control: AbstractControl<any, any>): string {
    return getErrorMessage(control);
  }

  handleImageUpload(url: string) {
    this.form.get('image')!.patchValue(url);
  }

  private updateNumberOfDays() {
    const value = this.days.length > 0 ? this.days.length : '';
    this.numberOfDays.markAsDirty();
    this.numberOfDays.patchValue(value);
  }
}
