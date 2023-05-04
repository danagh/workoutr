import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { Router } from '@angular/router';
import { User } from '../types/common';
import { BehaviorSubject, Observable, map } from 'rxjs';

const USER_KEY = 'user';
const USER_DATA_KEY = 'user_data';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  private userSubject = new BehaviorSubject<firebase.User | null>(null);
  userData$: Observable<firebase.User | null> = this.userSubject.asObservable();

  constructor(private auth: AngularFireAuth, private db: AngularFirestore, private router: Router) {
    this.auth.authState.subscribe((user: firebase.User | null) => {
      if (user) {
        this.userSubject.next(user);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      } else {
        localStorage.setItem(USER_KEY, 'null');
        localStorage.setItem(USER_DATA_KEY, 'null');
      }
    });

    const user = localStorage.getItem(USER_KEY);
    if (user) {
      this.userSubject.next(JSON.parse(user));
    }
  }

  ngOnDestroy() {
    this.userSubject.unsubscribe();
  }

  signIn(email: string, password: string): Promise<firebase.User | null> {
    return this.auth.signInWithEmailAndPassword(email, password)
      .then((result: firebase.auth.UserCredential) => {
        return result.user;
      });
  }

  handleSignIn(user: firebase.User): Promise<boolean> {
    return this.setUserData(user)
      .then(() => {
        return this.db.collection<User>('users').doc(user.uid).ref.get()
      })
      .then((result) => {
        if (result.exists) {
          localStorage.setItem(USER_DATA_KEY, JSON.stringify(result.data()));
          return true;
        } else {
          localStorage.setItem(USER_DATA_KEY, 'null');
          return false;
        }
      });
  }

  signUp(email: string, password: string, name: string, interests: string[]): Promise<void> {
    return this.auth.createUserWithEmailAndPassword(email, password)
      .then((result: firebase.auth.UserCredential) => {
        if (result.user) {
          this.setUserData(result.user, name, interests);
          return result.user.sendEmailVerification();
        }

        return;
      });
  }

  signOut() {
    this.auth.signOut()
      .then(() => {
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(USER_DATA_KEY);
        this.userSubject.next(null);
        this.router.navigate(['auth/sign-in']);
      })
  }

  get isLoggedIn(): Observable<boolean> {
    return this.userData$.pipe(
      map(user => !!user && user.emailVerified)
    )
  }

  get loggedInUser(): User | null {
    const user = localStorage.getItem(USER_DATA_KEY);
    if (!user) {
      return null;
    }

    return JSON.parse(user);
  }

  get userInitials(): Observable<string | null> {
    return this.userData$.pipe(
      map((userData) => {
        const user = localStorage.getItem(USER_DATA_KEY);
        return user ? JSON.parse(user) as User : null;
      }),
      map((user: User | null) => {
        if (!user || !user.name) {
          return null;
        }

        return user!.name!.split(' ').reduce((acc, curr) => {
          return acc + curr[0].toUpperCase();
        }, '');
      })
    );
  }

  private setUserData(user: firebase.User, name?: string, interests?: string[]): Promise<void> {
    const userRef: AngularFirestoreDocument<User> = this.db.doc(`users/${user.uid}`);

    const userData: User = {
      id: user.uid,
      email: user.email ?? undefined,
      emailVerified: user.emailVerified,
    };

    if (!!name) {
      userData.name = name;
    }

    if (!!interests && interests.length > 0) {
      userData.interests = interests;
    }

    return userRef.set(userData, { merge: true });
  }
}
