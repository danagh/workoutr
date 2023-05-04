import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { getErrorMessage } from '../../helpers/formHelpers';

@Component({
  selector: 'app-form-input',
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.css']
})
export class FormInputComponent {
  @Input()
  control: AbstractControl<any, any> = new FormControl('');
  @Input()
  label: string = '';
  @Input()
  type: string = 'text';
  @Input()
  placeholder: string = '';
  @Input()
  addMargin: boolean = true;

  get formControl() {
    return this.control as FormControl<any>;
  }

  getErrorMessage(): string {
    return getErrorMessage(this.control);
  }
}
