import { Component, OnInit } from '@angular/core';
import { UserProgramService } from '../../workout/user-program.service';
import { ProgramService } from '../../workout/program.service';
import { Program, User, UserProgram, UserResults, BodyWithIdentifier, UserWorkout } from '../../types/common';
import { AuthService } from '../../auth/auth.service';
import { UserResultsService } from '../../workout/user-results.service';
import { UserWorkoutService } from '../../workout/user-workout.service';

@Component({
  selector: 'app-my-workouts',
  templateUrl: './my-workouts.component.html',
  styleUrls: ['./my-workouts.component.css']
})
export class MyWorkoutsComponent implements OnInit {
  user: User | null;
  userWorkouts: BodyWithIdentifier<UserWorkout>[] | null = null;
  results: UserResults | undefined | null = null;
  userPrograms: BodyWithIdentifier<UserProgram>[] | null = null;
  finishedUserPrograms: BodyWithIdentifier<UserProgram>[] | null = null;
  programs: Program[] = [];
  startedPrograms: boolean[] = [];
  addingPrograms: boolean[] = [];
  startingFinishedPrograms: boolean[] = [];

  constructor(
    private authService: AuthService, 
    private programService: ProgramService, 
    private userProgramService: UserProgramService,
    private userResultsService: UserResultsService,
    private userWorkoutService: UserWorkoutService) {
    this.user = this.authService.loggedInUser;

    this.userWorkoutService.paginatedWorkoutsOutput.subscribe(result => {
      if (!this.userWorkouts) {
        this.userWorkouts = result;
      } else {
        this.userWorkouts = [...this.userWorkouts, ...result];
      }
    });
    
    this.programService.programsFilterOutput.subscribe(result => {
      this.programs = result;
    });
  }

  ngOnInit() {
    this.userResultsService.getUserResults(this.user!.id)
      .then(results => {
        this.results = results;
      });

    this.userProgramService.filterUserPrograms(this.user!.id, 'following', { attribute: 'finished', operator: '==', value: false })
      .subscribe(result => {
        this.startedPrograms = [];
        this.addingPrograms = [];
        this.userPrograms = [];
        const programIds = result.map((userProgram: BodyWithIdentifier<UserProgram>) => {
          this.startedPrograms.push(!!userProgram.body.started);
          this.addingPrograms.push(false);
          this.userPrograms!.push(userProgram);
          return userProgram.body.id
        });

      if (programIds.length > 0) {
        this.programService.searchPrograms([{ attribute: 'id', operator: 'in', value: programIds }]);
      }
    });

    this.userProgramService.filterUserPrograms(this.user!.id, 'finishedDate', { attribute: 'finished', operator: '==', value: true })
      .subscribe(result => {
        this.startingFinishedPrograms = [];
        this.finishedUserPrograms = result;
        result.forEach(() => { this.startingFinishedPrograms.push(false); })
      });
  }

  getUserProgramById(programId: string): BodyWithIdentifier<UserProgram> | undefined {
    return this.userPrograms?.find(userProgram => userProgram.body.id === programId);
  }

  startProgram(programId: string, index: number) {
    this.addingPrograms[index] = true;
    this.userProgramService.startProgram(this.user!.id, programId)
      .subscribe(() => {
        this.addingPrograms[index] = false;
        this.startedPrograms[index] = true;
      });
  }

  startFinishedProgram(finishedProgram: UserProgram, index: number) {
    this.startingFinishedPrograms[index] = true;
    this.userProgramService.addProgramToUser(this.user!.id, finishedProgram.id, finishedProgram.title)
      .then(() => {
        this.userProgramService.startProgram(this.user!.id, finishedProgram.id)
          .subscribe(() => {
            // Do nothing?
          });
      });
  }

  finishedProgramNotOngoing(finishedProgramId: string): boolean {
    return this.userPrograms?.findIndex(userProgram => userProgram.body.id === finishedProgramId) === -1;
  }

  loadMoreWorkouts() {
    this.userWorkoutService.loadMoreWorkouts(this.user!.id);
  }
}
