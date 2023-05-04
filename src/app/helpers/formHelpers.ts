import { AbstractControl } from '@angular/forms';
import { ExerciseResultSet, UserWorkout } from '../types/common';

export const getErrorMessage = (control: AbstractControl<any, any>): string => {
  if (!control.errors) {
    return '';
  }

  if (control.errors['required']) {
    return 'Fältet är obligatoriskt';
  } else if (control.errors['email']) {
    return 'Ange en korrekt e-postadress'
  } else if (control.errors['minlength']) {
    return `Minst ${control.errors['minlength'].requiredLength} tecken måste anges`;
  } else if (control.errors['confirmedValidator']) {
    return 'Lösenorden stämmer inte överrens';
  } else if (control.errors['minValueError']) {
    return `Värdet måste vara större än ${control.errors['minValueError'].minValue}`
  }

  return 'Ett oväntat fel uppstod';
}

export const getWorkoutTypes = (): string[] => {
  return ['Bodybuilding', 'Crossfit', 'Hobby', 'Powerbuilding', 'Powerlifting', 'Strongman', 'Weightlifting'];
}

export const getWorkoutTotals = (userWorkout: UserWorkout): { sets: number, weight: number, reps: number} => {
  const sets = userWorkout.results.reduce((acc, curr) => {
    return acc + curr.sets.length;
  }, 0);

  const weight = userWorkout.results.reduce((acc, curr) => {
    return acc + getExerciseTotalForAttribute(curr.sets, 'weight');
  }, 0);

  const reps = userWorkout.results.reduce((acc, curr) => {
    return acc + getExerciseTotalForAttribute(curr.sets, 'reps');
  }, 0);

  return { sets, weight, reps };
}

export const getExerciseTotalForAttribute = (sets: ExerciseResultSet[], attribute: keyof ExerciseResultSet): number => {
  return sets.reduce((acc, curr) => {
    if (!curr[attribute]) {
      return acc;
    }

    return acc + parseInt(curr[attribute].toString());
  }, 0);
}

export const createTimer = (interval: number, callback?: (elapsedTime: number, minutes: number, seconds: number) => void): NodeJS.Timer => {
  let elapsedTime: number = 0;
  return setInterval(() => {
    elapsedTime++;
    const { minutes, seconds } = calculateMinutesAndSeconds(elapsedTime);

    if (callback) {
      callback(elapsedTime, minutes, seconds);
    }
  }, interval);
}

export const calculateMinutesAndSeconds = (time: number): { minutes: number, seconds: number } => {
  const minutes: number = Math.floor(time / 60);
  const seconds: number = time - minutes * 60;

  return { minutes, seconds };
}

export const addZeroIfSingleDigit = (num: number): string => {
  return num < 10 ? '0' + num : num.toString();
}