import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { getErrorMessage } from '../../helpers/formHelpers';

@Component({
  selector: 'app-form-error',
  templateUrl: './form-error.component.html',
  styleUrls: ['./form-error.component.css']
})
export class FormErrorComponent {
  @Input()
  control: AbstractControl<any, any> = new FormControl('');

  getErrorMessage(): string {
    return getErrorMessage(this.control);
  }

}
