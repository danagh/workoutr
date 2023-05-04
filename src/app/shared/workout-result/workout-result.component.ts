import { Component, Input } from '@angular/core';
import { UserWorkout } from '../../types/common';
import { getWorkoutTotals } from '../../helpers/formHelpers';

@Component({
  selector: 'app-workout-result',
  templateUrl: './workout-result.component.html',
  styleUrls: ['./workout-result.component.css']
})
export class WorkoutResultComponent {
  @Input() userWorkout: UserWorkout | undefined | null;
  @Input() showTitle: boolean = true;
  totalSets: number = 0;
  totalWeight: number = 0;
  totalReps: number = 0;

  ngOnInit() {
    if (this.userWorkout) {
      const { sets, weight, reps } = getWorkoutTotals(this.userWorkout);
      this.totalSets = sets;
      this.totalWeight = weight;
      this.totalReps = reps;
    }
  }
}
