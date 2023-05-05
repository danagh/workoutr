import { Injectable, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { FilterQuery, BodyWithIdentifier, UserProgram } from '../types/common';
import { Subject, Observable, switchMap, map, shareReplay } from 'rxjs';
import { NotificationsService } from '../notifications/notifications.service';

interface UserProgramIdentifier {
  userId: string;
  programId: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserProgramService implements OnDestroy {
  private activeProgramInput: Subject<UserProgramIdentifier>;
  activeProgramOutput: Observable<firebase.firestore.QueryDocumentSnapshot<UserProgram> | undefined>;

  constructor(private db: AngularFirestore, private notificationsService: NotificationsService) {
    this.activeProgramInput = new Subject();
    this.activeProgramOutput = this.activeProgramInput.pipe(
      switchMap((identifier: UserProgramIdentifier) => {
        return this.db.collection<UserProgram>(`users/${identifier.userId}/programs`, ref => 
          ref
          .orderBy('following')
          .where('id', '==', identifier.programId)
          .where('finished', '==', false)
        ).get().pipe(
          map(userPrograms => {
            if (userPrograms.empty) {
              return undefined;
            } else {
              return userPrograms.docs[0];
            }
          }),
          shareReplay()
        );
      })
    )
  }

  ngOnDestroy() {
    this.activeProgramInput.unsubscribe();
  }

  addProgramToUser(userId: string, programId: string, programTitle: string): Promise<boolean> {
    const userProgram = {
      id: programId,
      title: programTitle,
      following: new Date(),
      finished: false,
    };

    return this.db.collection<UserProgram>(`users/${userId}/programs`).add(userProgram)
      .then(() => {
        this.notificationsService.addSuccess('Programmet har lagts till!');
        return true;
      })
      .catch(() => {
        this.notificationsService.addError('Programmet kunde inte läggas till.')
        return false;
      })
  }

  getUserPrograms(userId: string): Observable<UserProgram[]> {
    return this.db.collection<UserProgram>(`users/${userId}/programs`, ref => ref.orderBy('following'))
      .snapshotChanges()
      .pipe(
        map(result => result.map(snap => snap.payload.doc.data()))
      )
  }

  filterUserPrograms(userId: string, order: string, filterQuery?: FilterQuery): Observable<BodyWithIdentifier<UserProgram>[]> {
    return this.db.collection<UserProgram>(`users/${userId}/programs`, ref => {
      let query = ref.orderBy(order);
      if (filterQuery) {
        query = ref.where(filterQuery.attribute, filterQuery.operator as firebase.firestore.WhereFilterOp, filterQuery.value);
      }

      return query;
    }).snapshotChanges().pipe(
      map(result => result.map(snap => { 
        return { id: snap.payload.doc.id, body: snap.payload.doc.data() } 
      }))
    );
  }

  getActiveUserProgram(userId: string, programId: string) {
    this.activeProgramInput.next({ userId, programId });
  }

  getUserProgram(userId: string, userProgramId: string): Promise<UserProgram | undefined> {
    return this.db.doc<UserProgram>(`users/${userId}/programs/${userProgramId}`).ref.get()
      .then(doc => doc.exists ? doc.data() : undefined);
  }

  startProgram(userId: string, programId: string): Observable<boolean> {
    return this.performUpdate(userId, programId, { started: new Date(), nextTrainingWeek: 1, nextTrainingDay: 1 });
  }

  updateNextTraining(userId: string, programId: string, nextTrainingWeek: number, nextTrainingDay: number, finished?: boolean): Observable<boolean> {
    const updateModel: Partial<UserProgram> = finished 
      ? { finished: true, finishedDate: new Date()} 
      : { nextTrainingWeek, nextTrainingDay };
    return this.performUpdate(userId, programId, updateModel);
  }

  private performUpdate(userId: string, programId: string, body: Partial<UserProgram>): Observable<boolean> {
    return new Observable(subscriber => {
      this.activeProgramOutput.subscribe(userProgram => {
        if (!userProgram || !userProgram.exists) {
          subscriber.next(false);
          subscriber.complete();
        } else {
          userProgram.ref.update(body)
            .then(() => {
              subscriber.next(true);
              subscriber.complete();
            });
        }
      });

      this.getActiveUserProgram(userId, programId);
    });
  }
}
