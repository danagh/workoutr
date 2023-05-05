import { Injectable, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { UserWorkout, FilterQueryWithUser, BodyWithIdentifier } from '../types/common';
import { Observable, Subject, map, switchMap, shareReplay } from 'rxjs';
import { Router } from '@angular/router';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable({
  providedIn: 'root'
})
export class UserWorkoutService implements OnDestroy {
  private paginatedWorkoutsInput: Subject<string>;
  private filterWorkoutsInput: Subject<FilterQueryWithUser>;
  private lastInResponse: firebase.firestore.QueryDocumentSnapshot<UserWorkout> | null;
  private pageSize: number = 4;
  paginatedWorkoutsOutput: Observable<BodyWithIdentifier<UserWorkout>[]>;
  filterWorkoutsOutput: Observable<UserWorkout[]>;
  

  constructor(private db: AngularFirestore, private router: Router, private notificationsService: NotificationsService) {
    this.paginatedWorkoutsInput = new Subject();
    this.filterWorkoutsInput = new Subject();

    this.router.events.subscribe(() => {
      this.lastInResponse = null;
    });

    this.paginatedWorkoutsOutput = this.paginatedWorkoutsInput.pipe(
      switchMap(userId => {
        return this.db.collection<UserWorkout>(`users/${userId}/workouts`, ref => {
          if (this.lastInResponse) {
            return ref
              .orderBy('finished', 'desc')
              .limit(this.pageSize)
              .startAfter(this.lastInResponse);
          } else {
            return ref.orderBy('finished', 'desc').limit(this.pageSize);
          }
        }).get().pipe(
          map(result => {
            this.lastInResponse = result.docs.length > 0 ? result.docs[result.docs.length - 1] : null;
            return result.docs.map(snap => {
              return {
                id: snap.id,
                body: snap.data()
              };
            });
          })
        )
      })
    );

    this.filterWorkoutsOutput = this.filterWorkoutsInput.pipe(
      switchMap(filterQueryWithUser => {
        return this.db.collection<UserWorkout>(`users/${filterQueryWithUser.userId}/workouts`, ref => {
          let query: firebase.firestore.Query = filterQueryWithUser.sort 
          ? ref.orderBy(filterQueryWithUser.sort, (filterQueryWithUser.sortDirection || 'asc') as firebase.firestore.OrderByDirection) 
          : ref;
          
          filterQueryWithUser.queries.forEach(q => {
            query = query.where(q.attribute, q.operator as firebase.firestore.WhereFilterOp, q.value);
          });

          if (filterQueryWithUser.limit) {
            query = query.limit(filterQueryWithUser.limit);
          }

          return query;
        }).snapshotChanges().pipe(
          map(result => result.map(snap => snap.payload.doc.data())),
          shareReplay()
        )
      })
    );
  }

  saveWorkoutForProgram(userId: string, userWorkout: UserWorkout): Promise<string> {
    userWorkout.id = this.db.createId();
    userWorkout.finished = new Date();

    return this.db.collection<UserWorkout>(`users/${userId}/workouts`).add(userWorkout)
      .then(response => {
        this.notificationsService.addSuccess('Resultatet har registrerats!');
        return response.id;
      })
      .catch(() => {
        this.notificationsService.addError('Resultatet kunde inte sparas.');
        return '';
      })
  }

  getWorkout(userId: string, workoutId: string): Promise<UserWorkout | undefined> {
    return this.db.collection('users').doc(userId).collection('workouts').doc<UserWorkout>(workoutId).ref.get()
      .then(doc => {
        return doc.exists ? doc.data() : undefined;
      });
  }

  loadMoreWorkouts(userId: string) {
    this.paginatedWorkoutsInput.next(userId);
  }

  filterWorkouts(query: FilterQueryWithUser) {
    this.filterWorkoutsInput.next(query);
  }

  ngOnDestroy() {
    this.paginatedWorkoutsInput.unsubscribe();
    this.filterWorkoutsInput.unsubscribe();
  }
}
