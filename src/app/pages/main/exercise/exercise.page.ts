import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../../services/booking/booking.service';
import { Exercise, Session } from '../../../services/auth/auth-service.service';

@Component({
  selector: 'app-exercise',
  templateUrl: './exercise.page.html',
  styleUrls: ['./exercise.page.scss'],
})
export class ExercisePage implements OnInit {
  exerciseDetails: Exercise;
  remainingTime: number;
  timerRunning: boolean = false;
  timer: any;
  currentRepetition: number = 0;
  breakTime: number = 30; // 30 seconds break between repetitions
  sessionDetails: Session;
  currentExerciseIndex: number;

  constructor(private route: ActivatedRoute, private bookingService: BookingService, private router: Router) {}

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.exerciseDetails = navigation.extras.state['exercise'];
      this.sessionDetails = navigation.extras.state['session'];
      this.currentExerciseIndex = navigation.extras.state['index'];
      this.remainingTime = this.exerciseDetails.duration; // Set the remaining time based on the exercise duration
      console.log('exerciseDetails:', this.exerciseDetails);
    } else {
      throw new Error('No exercise details found in navigation state');
    }
  }

  startTimer() {
    this.timerRunning = true;
    this.timer = setInterval(() => {
      this.remainingTime--;
      if (this.remainingTime <= 0) {
        clearInterval(this.timer);
        this.timerRunning = false;
        this.currentRepetition++;
        if (this.currentRepetition < this.exerciseDetails.repetitions) {
          this.showBreakDialog();
        } else {
          this.showCompletionDialog();
        }
      }
    }, 1000);
  }

  async showBreakDialog() {
    const alert = document.createElement('ion-alert');
    alert.header = 'Break Time';
    alert.message = `The same exercise will start again in ${this.breakTime} seconds.`;
    alert.buttons = [
      {
        text: 'OK',
        handler: () => {
          this.startBreakTimer();
        }
      }
    ];

    document.body.appendChild(alert);
    await alert.present();
  }

  startBreakTimer() {
    this.remainingTime = this.breakTime;
    this.timerRunning = true;
    this.timer = setInterval(() => {
      this.remainingTime--;
      if (this.remainingTime <= 0) {
        clearInterval(this.timer);
        this.remainingTime = this.exerciseDetails.duration;
        this.startTimer();
      }
    }, 1000);
  }

  async showCompletionDialog() {
    const alert = document.createElement('ion-alert');
    alert.header = 'Exercise finished';
    alert.message = 'Exercise finished';
    alert.buttons = [
      {
        text: 'Next exercise',
        handler: () => {
          this.startNextExercise();
        }
      },
      {
        text: 'Later',
        role: 'cancel'
      }
    ];

    document.body.appendChild(alert);
    await alert.present();
  }

  async startNextExercise() {
    this.currentExerciseIndex++;
    if (this.currentExerciseIndex < this.sessionDetails.exercises.length) {
      const nextExercise = this.sessionDetails.exercises[this.currentExerciseIndex];
      this.router.navigate(['/exercise'], { state: { exercise: nextExercise, session: this.sessionDetails, index: this.currentExerciseIndex } });
    } else {
      await this.markSessionAsCompleted();
      const alert = document.createElement('ion-alert');
      alert.header = 'Session completed';
      alert.message = 'All exercises are completed. The session is marked as completed.';
      alert.buttons = ['OK'];
      document.body.appendChild(alert);
      await alert.present();
    }
  }

  async markSessionAsCompleted() {
    try {
      this.sessionDetails.status = 'completed';
      if (this.sessionDetails.sessionId) {
        await this.bookingService.updateSessionStatus(this.sessionDetails.sessionId, 'completed');
      } else {
        console.error('Session ID is undefined');
      }
    } catch (error) {
      console.error('Error marking session as completed:', error);
    }
  }
}