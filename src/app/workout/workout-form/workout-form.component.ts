import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Exercise, ExerciseResult, Program, User, UserWorkout } from '../../types/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { ProgramService } from '../program.service';
import { UserProgramService } from '../user-program.service';
import { UserWorkoutService } from '../user-workout.service';
import { UserResultsService } from '../user-results.service';
import { addZeroIfSingleDigit, createTimer, getWorkoutTotals } from '../../helpers/formHelpers';
import { NewExerciseDialogComponent } from '../new-exercise-dialog/new-exercise-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-workout-form',
  templateUrl: './workout-form.component.html',
  styleUrls: ['./workout-form.component.css']
})
export class WorkoutFormComponent implements OnInit, OnDestroy {
  private routeSub: Subscription;
  program: Program | undefined | null = null;
  exercises: Exercise[] = [];
  user: User | null;
  trainingWeek: number = 0;
  trainingDay: number = 0;
  workoutTimeInterval: NodeJS.Timer;
  workoutTime: number = 0;
  displayWorkoutTime: string = '';
  isSaving: boolean = false;
  errorMessage: string = '';
  workoutForm = this.fb.group({
    results: this.fb.array([])
  });

  constructor(
    private route: ActivatedRoute, 
    private programService: ProgramService, 
    private authService: AuthService,
    private userProgramService: UserProgramService,
    private userWorkoutService: UserWorkoutService,
    private userResultsService: UserResultsService,
    private fb: FormBuilder,
    private router: Router,
    public dialog: MatDialog) {
    this.user = this.authService.loggedInUser;
  }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.trainingWeek = parseInt(params['week']);
      this.trainingDay = parseInt(params['day']);

      this.programService.getProgram(params['id']).then(program => {
        this.program = program;

        if (program) {
          this.exercises = program.trainingDays[this.trainingDay - 1].exercises || [];
          this.initializeForm();
        }
      });
    });

    this.startTimer();
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.endTimer();
  }

  get results() {
    return this.workoutForm.get('results') as FormArray;
  }

  removeExercise(index: number) {
    this.exercises.splice(index, 1);
    this.results.removeAt(index);
  }

  resultControlAsGroup(result: AbstractControl<any, any>) {
    return result as FormGroup;
  }

  openNewExerciseDialog() {
    const dialogRef = this.dialog.open(NewExerciseDialogComponent);

    dialogRef.afterClosed().subscribe((result?: Exercise) => {
      if (result) {
        this.exercises.push(result);
        this.addExercise(result);
      }
    });
  }

  handleSubmit() {
    if (!this.workoutForm.valid) {
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.endTimer();

    const userWorkout: UserWorkout = {
      programId: this.program!.id!,
      programTitle: this.program!.title,
      programWeek: this.trainingWeek,
      programDay: this.trainingDay,
      duration: this.displayWorkoutTime,
      results: this.results.value as ExerciseResult[]
    }

    this.userWorkoutService.saveWorkoutForProgram(this.user!.id, userWorkout)
      .then((userWorkoutId: string) => {
        if (!userWorkoutId) {
          this.errorMessage = 'Resultatet kunde inte sparas. Försök igen lite senare.';
          return;
        }

        const programLength = parseInt(this.program!.length.toString());
        const programTrainingDays = this.program!.numberOfDays;
        let nextTrainingWeek: number = this.trainingWeek;
        let nextTrainingDay: number = this.trainingDay;
        let finishedProgram: boolean = false;

        if (programTrainingDays === this.trainingDay) {
          if (programLength === this.trainingWeek) {
            finishedProgram = true;
          } else {
            nextTrainingWeek += 1;
            nextTrainingDay = 1;
          }
        } else {
          nextTrainingDay += 1;
        }

        this.userProgramService.updateNextTraining(this.user!.id, this.program!.id!, nextTrainingWeek, nextTrainingDay, finishedProgram)
          .subscribe(() => {
            const totals = getWorkoutTotals(userWorkout);
            const userResultBody = {
              userId: this.user!.id,
              programId: this.program!.id!,
              programTitle: this.program!.title,
              finished: finishedProgram,
              nextTrainingWeek,
              nextTrainingDay,
              totalWeight: totals.weight,
              totalReps: totals.reps,
              totalSets: totals.sets
            };

            this.userResultsService.setUserResults(userResultBody).then(() => {
              this.isSaving = false;
              this.router.navigateByUrl(`/workout/${this.program!.id!}/${this.trainingWeek}/${this.trainingDay}/${userWorkoutId}`);
            });
          });
      });
  } 

  private startTimer() {
    this.workoutTime = 0;
    this.displayWorkoutTime = '00:00';
    this.workoutTimeInterval = createTimer(1000, (elapsedTime: number, minutes: number, seconds: number) => {
      this.workoutTime = elapsedTime;
      this.displayWorkoutTime = addZeroIfSingleDigit(minutes) + ':' + addZeroIfSingleDigit(seconds);
    });
  }

  private endTimer() {
    clearInterval(this.workoutTimeInterval);
  }

  private initializeForm() {
    this.exercises.forEach(exercise => {
      this.addExercise(exercise);
    });
  }

  private addExercise(exercise: Exercise) {
    const resultGroup = this.fb.group({
      name: [exercise.name],
      sets: this.fb.array([]),
      comments: ['']
    });

    this.results.push(resultGroup);
  }
}
