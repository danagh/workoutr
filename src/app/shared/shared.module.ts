import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormInputComponent } from './form-input/form-input.component';
import { FormErrorComponent } from './form-error/form-error.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';

import { LevelPipe } from '../pipes/level.pipe';
import { ExerciseTypePipe } from '../pipes/exercise-type.pipe';
import { LoadingButtonComponent } from './loading-button/loading-button.component';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { LazyImgDirective } from './lazy-img.directive';
import { ExerciseInfoComponent } from './exercise-info/exercise-info.component';
import { InfoWindowComponent } from './info-window/info-window.component';
import { FbTimestampPipe } from '../pipes/fb-timestamp.pipe';
import { AvgSetWeightPipe } from '../pipes/avg-set-weight.pipe';
import { TimerComponent } from './timer/timer.component';
import { SkeletonDirective } from './skeleton.directive';
import { SkeletonComponent } from './skeleton/skeleton.component';
import { PaginationListComponent } from './pagination-list/pagination-list.component';
import { WorkoutResultComponent } from './workout-result/workout-result.component';



@NgModule({
  declarations: [
    FormInputComponent,
    FormErrorComponent,
    LevelPipe,
    ExerciseTypePipe,
    FbTimestampPipe,
    AvgSetWeightPipe,
    LoadingButtonComponent,
    ImageUploadComponent,
    LazyImgDirective,
    ExerciseInfoComponent,
    InfoWindowComponent,
    TimerComponent,
    SkeletonDirective,
    SkeletonComponent,
    PaginationListComponent,
    WorkoutResultComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatCardModule
  ],
  exports: [
    FormInputComponent,
    FormErrorComponent,
    LoadingButtonComponent,
    ImageUploadComponent,
    ExerciseInfoComponent,
    LevelPipe,
    ExerciseTypePipe,
    FbTimestampPipe,
    AvgSetWeightPipe,
    LazyImgDirective,
    SkeletonDirective,
    SkeletonComponent,
    InfoWindowComponent,
    TimerComponent,
    PaginationListComponent,
    WorkoutResultComponent,
  ]
})
export class SharedModule { }
