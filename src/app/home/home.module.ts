import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeRoutingModule } from './home-routing.module';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { SharedModule } from '../shared/shared.module';
import { ProgramComponent } from './program/program.component';
import { ProgramListComponent } from './program-list/program-list.component';
import { MyWorkoutsComponent } from './my-workouts/my-workouts.component';
import { ProgramCardComponent } from './program-card/program-card.component';
import { FinishedProgramComponent } from './finished-program/finished-program.component';
import { FinishedWorkoutComponent } from './finished-workout/finished-workout.component';



@NgModule({
  declarations: [
    DashboardComponent,
    ProgramComponent,
    ProgramListComponent,
    MyWorkoutsComponent,
    ProgramCardComponent,
    FinishedProgramComponent,
    FinishedWorkoutComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
  ],
  exports: [
    DashboardComponent
  ]
})
export class HomeModule { }
