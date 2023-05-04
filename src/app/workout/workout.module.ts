import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { MatChipsModule } from '@angular/material/chips';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';

import { WorkoutRoutingModule } from './workout-routing.module';
import { FormComponent } from './form/form.component';
import { GeneralInformationComponent } from './form/general-information/general-information.component';
import { SharedModule } from '../shared/shared.module';
import { ExercisesComponent } from './form/exercises/exercises.component';
import { ExerciseComponent } from './form/exercise/exercise.component';
import { TraningDaysComponent } from './form/traning-days/traning-days.component';
import { WorkoutComponent } from './workout/workout.component';
import { WorkoutFormComponent } from './workout-form/workout-form.component';
import { ExerciseFormComponent } from './exercise-form/exercise-form.component';
import { WorkoutFinishedComponent } from './workout-finished/workout-finished.component';
import { NewExerciseDialogComponent } from './new-exercise-dialog/new-exercise-dialog.component';

@NgModule({
  declarations: [
    FormComponent,
    GeneralInformationComponent,
    ExercisesComponent,
    ExerciseComponent,
    TraningDaysComponent,
    WorkoutComponent,
    WorkoutFormComponent,
    ExerciseFormComponent,
    WorkoutFinishedComponent,
    NewExerciseDialogComponent
  ],
  imports: [
    CommonModule,
    WorkoutRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatStepperModule,
    MatChipsModule,
    MatRadioModule,
    MatCheckboxModule,
    MatSelectModule,
    MatExpansionModule,
    MatAutocompleteModule,
    MatIconModule,
    MatDialogModule,
    SharedModule
  ]
})
export class WorkoutModule { }
