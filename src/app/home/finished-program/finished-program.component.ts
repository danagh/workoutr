import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserWorkoutService } from '../../workout/user-workout.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { FilterQueryWithUser, User, UserProgram, UserWorkout } from '../../types/common';
import { AuthService } from '../../auth/auth.service';
import { UserProgramService } from '../../workout/user-program.service';
import { getWorkoutTotals } from '../../helpers/formHelpers';

@Component({
  selector: 'app-finished-program',
  templateUrl: './finished-program.component.html',
  styleUrls: ['./finished-program.component.css']
})
export class FinishedProgramComponent implements OnInit, OnDestroy {
  private routeSub: Subscription;
  user: User | null;
  userProgram: UserProgram | undefined;
  programWorkouts: UserWorkout[] = [];
  totalSets: number = 0;
  totalWeight: number = 0;
  totalReps: number = 0;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private userProgramService: UserProgramService,
    private userWorkoutService: UserWorkoutService) {
      this.user = this.authService.loggedInUser;
      this.userWorkoutService.filterWorkoutsOutput.subscribe(programWorkouts => {
        this.programWorkouts = programWorkouts;

        programWorkouts.forEach(programWorkout => {
          const { sets, weight, reps } = getWorkoutTotals(programWorkout);
          this.totalSets += sets;
          this.totalWeight += weight;
          this.totalReps += reps;
        });
      });
  }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.userProgramService.getUserProgram(this.user!.id, params['userProgramId'])
        .then(userProgram => {
          this.userProgram = userProgram;

          if (!userProgram) {
            return;
          }

          const queryBody: FilterQueryWithUser = {
            userId: this.user!.id,
            sort: 'finished',
            queries: [
              { attribute: 'programId', operator: '==', value: userProgram.id },
              { attribute: 'finished', operator: '>', value: userProgram.started },
              { attribute: 'finished', operator: '<', value: userProgram.finishedDate }
            ]
          };

          this.userWorkoutService.filterWorkouts(queryBody);
        });
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
