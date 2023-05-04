import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { User, UserWorkout } from '../../types/common';
import { AuthService } from '../../auth/auth.service';
import { UserWorkoutService } from '../../workout/user-workout.service';

@Component({
  selector: 'app-finished-workout',
  templateUrl: './finished-workout.component.html',
  styleUrls: ['./finished-workout.component.css']
})
export class FinishedWorkoutComponent implements OnInit, OnDestroy {
  private routeSub: Subscription;
  user: User | null;
  userWorkout: UserWorkout | undefined | null = null;
  

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private userWorkoutService: UserWorkoutService) {
      this.user = this.authService.loggedInUser;
  }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.userWorkoutService.getWorkout(this.user!.id, params['workoutId'])
        .then(userWorkout => {
          this.userWorkout = userWorkout;
        });
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
