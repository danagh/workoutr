import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { FilterQuery, Program } from '../types/common';
import { Observable, Subject, map, switchMap, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgramService implements OnDestroy {
  private collection = 'programs';
  private created = 'created';
  private programsInput: Subject<number>;
  private programsFilterInput: Subject<FilterQuery[]>;
  private pageSize = 4;
  private lastInResponse: firebase.firestore.QueryDocumentSnapshot<Program> | null;
  programsOutput: Observable<Program[]>; 
  programsFilterOutput: Observable<Program[]>;

  constructor(private db: AngularFirestore, private router: Router) {
    this.programsInput = new Subject();
    this.programsFilterInput = new Subject();

    this.router.events.subscribe(() => {
      this.lastInResponse = null;
    });

    this.programsOutput = this.programsInput.pipe(
      switchMap(() => {
        return this.db.collection<Program>(this.collection, ref => {
          if (this.lastInResponse) {
            return ref
              .orderBy(this.created, 'desc')
              .limit(this.pageSize)
              .startAfter(this.lastInResponse)
          } else {
            return ref.orderBy(this.created, 'desc').limit(this.pageSize);
          }
        }).get().pipe(
          map(result => {
            this.lastInResponse = result.docs.length > 0 ? result.docs[result.docs.length - 1] : null;
            return result.docs.map(snap => snap.data())
          })
        )
      })
    );

    this.programsFilterOutput = this.programsFilterInput.pipe(
      switchMap(queries => {
        return this.db.collection<Program>(this.collection, ref => {
          let query: firebase.firestore.Query = ref;
          queries.forEach(q => {
            query = ref.where(q.attribute, q.operator as firebase.firestore.WhereFilterOp, q.value);
          });
          return query;
        }).snapshotChanges().pipe(
          map(result => result.map(snap => snap.payload.doc.data())),
          shareReplay()
        )
      })
    )
  }

  ngOnDestroy() {
    this.programsInput.unsubscribe();
    this.programsFilterInput.unsubscribe();
  }

  createProgram(program: Program) {
    program.id = this.db.createId();
    program.created = new Date();

    const programRef: AngularFirestoreDocument<Program> = this.db.doc(`${this.collection}/${program.id}`);

    programRef.set(program, { merge: true })
      .then(() => {
        this.router.navigate(['dashboard']);
      })
      .catch(err => {
        console.log(err);
        window.alert(err.message);
      })
  }

  getPrograms() {
    this.programsInput.next(this.pageSize);
  }

  searchPrograms(queries: FilterQuery[]) {
    this.programsFilterInput.next(queries);
  }

  getProgram(programId: string): Promise<Program | undefined> {
    return this.db.collection<Program>(this.collection).doc(programId).ref.get()
      .then((doc) => {
        if (doc.exists) {
          return doc.data();
        } else {
          return undefined;
        }
      });
  }
}
