import { FormBuilder, FormArray, FormGroup, AbstractControl,FormControl, Validators } from '@angular/forms';

export function MinValueValidator(minValueControl: FormControl<any>) {
    return (control: FormControl<any>) => {
        if (parseInt(control.value) <= parseInt(minValueControl.value)) {
            return { minValueError: { minValue: minValueControl.value } };
        }

        return null;
    }
}