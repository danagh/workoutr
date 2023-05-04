import { Component, Input } from '@angular/core';
import { Exercise } from '../../types/common';

@Component({
  selector: 'app-exercise-info',
  templateUrl: './exercise-info.component.html',
  styleUrls: ['./exercise-info.component.css']
})
export class ExerciseInfoComponent {
  @Input()
  exercise: Exercise;
}
