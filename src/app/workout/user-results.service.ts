import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { UserResults, UserResultBody } from '../types/common';

@Injectable({
  providedIn: 'root'
})
export class UserResultsService {

  constructor(private db: AngularFirestore) { }

  getUserResults(userId: string): Promise<UserResults | undefined> {
    return this.db.collection('users').doc(userId).collection('results').doc<UserResults>('result').ref.get()
      .then(doc => {
        return doc.exists ? doc.data() : undefined;
      })
  }

  setUserResults(body: UserResultBody): Promise<any> {
    return this.db.collection('users').doc(body.userId).collection('results').doc<UserResults>('result').ref.get()
      .then(doc => {
        if (doc.exists) {
          return this.updateUserResults(body, doc.data()!);
        } else {
          return this.createUserResults(body);
        }
      });
  }

  private updateUserResults(body: UserResultBody, current: UserResults): Promise<void> {
    const nextSession = this.createNextSession(body);
    const userResults: UserResults = {
      nextSession: nextSession,
      finishedPrograms: body.finished ? current.finishedPrograms + 1 : current.finishedPrograms,
      finishedWorkouts: current.finishedWorkouts + 1,
      totalWeight: current.totalWeight + body.totalWeight,
      totalReps: current.totalReps + body.totalReps,
      totalSets: current.totalSets + body.totalSets
    };

    return this.db.doc(`users/${body.userId}/results/result`).update(userResults);
  }

  private createUserResults(body: UserResultBody): Promise<void> {
    const nextSession = this.createNextSession(body);
    const userResults: UserResults = {
      nextSession: nextSession,
      finishedPrograms: body.finished ? 1 : 0,
      finishedWorkouts: 1,
      totalWeight: body.totalWeight,
      totalReps: body.totalReps,
      totalSets: body.totalSets
    };

    return this.db.doc(`users/${body.userId}/results/result`).set(userResults, { merge: true });
  }

  private createNextSession(body: UserResultBody): any {
    return body.finished ? firebase.firestore.FieldValue.delete() : {
      programId: body.programId,
      programTitle: body.programTitle,
      trainingWeek: body.nextTrainingWeek,
      trainingDay: body.nextTrainingDay
    };
  }
}
