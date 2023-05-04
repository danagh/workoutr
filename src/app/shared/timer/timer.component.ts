import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { addZeroIfSingleDigit, createTimer, calculateMinutesAndSeconds } from '../../helpers/formHelpers';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit, OnDestroy {
  @Input()
  time?: number;
  timerRunning: boolean = false;
  timerMode: ProgressBarMode = 'indeterminate';
  timerProgress: number = 100;
  timer: string = '';
  private timerInterval: NodeJS.Timer;

  constructor() {
  }

  ngOnInit() {
    if (this.time) {
      this.timerMode = 'determinate';
    }
  }

  ngOnDestroy(): void {
    this.timerRunning = false;
    clearInterval(this.timerInterval);
  }

  handleTimer() {
    this.timerRunning = !this.timerRunning;
    if (this.timerRunning) this.startTimer();
    else clearInterval(this.timerInterval);
  }

  private startTimer() {
    let startMinutes = 0;
    let startSeconds = 0;
    if (this.time) {
      const startTime = calculateMinutesAndSeconds(this.time);
      startMinutes = startTime.minutes;
      startSeconds = startTime.seconds;
    }

    this.timerProgress = 100;
    this.timer = addZeroIfSingleDigit(startMinutes) + ':' + addZeroIfSingleDigit(startSeconds);

    this.timerInterval = createTimer(1000, (elapsedTime: number, minutes: number, seconds: number) => {
      if (this.time) {
        if (this.time === elapsedTime) {
          this.timerRunning = false;
          clearInterval(this.timerInterval);
        } else {
          const timeRemaining = this.time - elapsedTime;
          this.timerProgress = (timeRemaining / this.time) * 100;

          const updatedTime = calculateMinutesAndSeconds(timeRemaining);
          minutes = updatedTime.minutes;
          seconds = updatedTime.seconds;
        }
      }

      this.timer = addZeroIfSingleDigit(minutes) + ':' + addZeroIfSingleDigit(seconds);
    });
  }
}
