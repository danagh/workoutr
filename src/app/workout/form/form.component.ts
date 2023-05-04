import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Program, TrainingDay } from 'src/app/types/common';
import { ProgramService } from '../program.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent {
  generalInformationForm = this.fb.group(
    {
      title: ['', [Validators.required]],
      description: [''],
      image: [''],
      days: this.fb.array([]),
      numberOfDays: ['', [Validators.required]],
      level: ['BEGINNER', [Validators.required]],
      type: ['', [Validators.required]],
      length: [4, [Validators.required]]
    }
  );

  trainingDaysForm = this.fb.group(
    {
      days: this.fb.array([])
    }
  );

  creatingProgram = false;

  constructor(private fb: FormBuilder, private programService: ProgramService) {

  }

  createProgram() {
    this.creatingProgram = true;
    
    const generalInformation = this.generalInformationForm.value;

    const program: Program = {
      title: generalInformation.title as string,
      description: generalInformation.description as string,
      image: generalInformation.image as string,
      days: generalInformation.days as string[],
      numberOfDays: parseInt(generalInformation.numberOfDays!),
      level: generalInformation.level as string,
      type: generalInformation.type as string,
      length: generalInformation.length as number,
      trainingDays: this.trainingDaysForm.value.days as TrainingDay[]
    }

    this.programService.createProgram(program);
  }

  getTrainingDays(): string[] {
    return this.generalInformationForm.controls['days'].value as string[];
  }
}
