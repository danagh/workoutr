import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormComponent } from './form/form.component';
import { WorkoutComponent } from './workout/workout.component';
import { WorkoutFormComponent } from './workout-form/workout-form.component';
import { WorkoutFinishedComponent } from './workout-finished/workout-finished.component';

const routes: Routes = [
  { path: 'create', component: FormComponent },
  { path: ':id', component: WorkoutComponent },
  { path: ':id/:week/:day', component: WorkoutFormComponent },
  { path: ':id/:week/:day/:workoutId', component: WorkoutFinishedComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkoutRoutingModule { }
