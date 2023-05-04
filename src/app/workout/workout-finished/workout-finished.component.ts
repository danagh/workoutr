import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { User, UserProgram, UserWorkout } from '../../types/common';
import { AuthService } from '../../auth/auth.service';
import { UserProgramService } from '../user-program.service';
import { UserWorkoutService } from '../user-workout.service';
import { getWorkoutTotals } from '../../helpers/formHelpers';

@Component({
  selector: 'app-workout-finished',
  templateUrl: './workout-finished.component.html',
  styleUrls: ['./workout-finished.component.css']
})
export class WorkoutFinishedComponent implements OnInit, OnDestroy {
  private routeSub: Subscription;
  userProgram: UserProgram | undefined;
  userWorkout: UserWorkout | undefined;
  user: User | null;
  totalWeight: number = 0;
  totalReps: number = 0;
  totalSets: number = 0;

  constructor(
    private route: ActivatedRoute, 
    private authService: AuthService, 
    private userProgramService: UserProgramService,
    private userWorkoutService: UserWorkoutService,) {
    this.user = this.authService.loggedInUser;

    this.userProgramService.activeProgramOutput.subscribe(result => {
      if (!!result && result.exists) {
        this.userProgram = result.data();
      }
    });
  }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.userProgramService.getActiveUserProgram(this.user!.id, params['id']);

      this.userWorkoutService.getWorkout(this.user!.id, params['workoutId'])
        .then(userWorkout => {
          this.userWorkout = userWorkout;

          if (userWorkout) {
            const totals = getWorkoutTotals(userWorkout);
            this.totalSets = totals.sets
            this.totalWeight = totals.weight
            this.totalReps = totals.reps
          }
        });
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
