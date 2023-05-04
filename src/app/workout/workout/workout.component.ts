import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Program, User, UserProgram, UserWorkout, FilterQueryWithUser } from '../../types/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { ProgramService } from '../program.service';
import { UserProgramService } from '../user-program.service';
import { UserWorkoutService } from '../user-workout.service';

@Component({
  selector: 'app-workout',
  templateUrl: './workout.component.html',
  styleUrls: ['./workout.component.css']
})
export class WorkoutComponent implements OnInit, OnDestroy {
  private routeSub: Subscription;
  program: Program | undefined | null = null;
  userProgram: UserProgram | undefined | null = null;
  lastWeekWorkout: UserWorkout | undefined | null = null;
  user: User | null;

  constructor(
    private route: ActivatedRoute, 
    private programService: ProgramService, 
    private authService: AuthService,
    private userProgramService: UserProgramService,
    private userWorkoutService: UserWorkoutService) {
    this.user = this.authService.loggedInUser;

    this.userWorkoutService.filterWorkoutsOutput.subscribe(programWorkouts => {
      this.lastWeekWorkout = programWorkouts.length > 0 ? programWorkouts[0] : undefined;
    });

    this.userProgramService.activeProgramOutput.subscribe(result => {
      if (!!result && result.exists) {
        this.userProgram = result.data();

        if (this.userProgram.nextTrainingWeek && this.userProgram.nextTrainingWeek > 1) {
          const queryBody: FilterQueryWithUser = {
            userId: this.user!.id,
            sort: 'finished',
            sortDirection: 'desc',
            limit: 1,
            queries: [
              { attribute: 'programId', operator: '==', value: this.userProgram.id },
              { attribute: 'programWeek', operator: '==', value: this.userProgram.nextTrainingWeek - 1 },
              { attribute: 'programDay', operator: '==', value: this.userProgram.nextTrainingDay }
            ]
          };

          this.userWorkoutService.filterWorkouts(queryBody);
        }
      }
    });
  }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.programService.getProgram(params['id']).then(program => {
        this.program = program;
      });

      this.userProgramService.getActiveUserProgram(this.user!.id, params['id']);
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
