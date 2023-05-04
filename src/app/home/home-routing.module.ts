import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgramComponent } from './program/program.component';
import { MyWorkoutsComponent } from './my-workouts/my-workouts.component';
import { FinishedProgramComponent } from './finished-program/finished-program.component';
import { FinishedWorkoutComponent } from './finished-workout/finished-workout.component';
import { AuthGuard } from '../shared/guard/auth.guard';

const routes: Routes = [
  { 
    path: '', 
    component: DashboardComponent,
  },
  {
    path: 'program/:id',
    component: ProgramComponent
  },
  {
    path: 'program/:programId/finished/:userProgramId',
    component: FinishedProgramComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'workout/:workoutId/finished',
    component: FinishedWorkoutComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'workouts',
    component: MyWorkoutsComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }