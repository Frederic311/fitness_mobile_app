import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../../services/booking/booking.service';
import { Exercise, Session } from '../../../services/auth/auth-service.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-exercise',
  templateUrl: './exercise.page.html',
  styleUrls: ['./exercise.page.scss'],
})
export class ExercisePage implements OnInit {
  @ViewChild('youtubePlayer') youtubePlayer: ElementRef;
  @ViewChild('videoPlayer') videoPlayer: ElementRef;
  @ViewChild('timerCanvas') timerCanvas: ElementRef;

  exerciseDetails: Exercise = { exerciseType: '', duration: 0, repetitions: 0, mediaUrl: '' ,completed:false};
  sessionDetails: Session = { sessionId: '', coachEmail: '', goal: '', startDateTime: new Date(), sportType: '', exercises: [], status: '' };
  remainingTime: number = 0;
  timerRunning: boolean = false;
  timer: any;
  currentRepetition: number = 0;
  breakTime: number = 5; // 30 seconds break between repetitions
  currentExerciseIndex: number = 0;
  totalDuration: number = 0;
  showCompletionPrompt: boolean = false;
  sanitizedMediaUrl: SafeResourceUrl;

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.exerciseDetails = navigation.extras.state['exercise'];
      this.sessionDetails = navigation.extras.state['sessionDetails'];
      this.currentExerciseIndex = navigation.extras.state['index'];
      this.remainingTime = this.exerciseDetails.duration; // Set the remaining time based on the exercise duration
      this.totalDuration = this.exerciseDetails.duration; // Store the total duration for animation
      console.log('exerciseDetails:', this.exerciseDetails);
      console.log('sessionDetails:', this.sessionDetails);
      console.log('Session ID:', this.sessionDetails?.sessionId); // Add console log for session ID
    } else {
      console.error('No exercise details found in navigation state');
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
          this.markExerciseAsCompleted();
          this.showCompletionDialog();
        }
      }
    }, 1000);
  }

  drawTimer(remainingTime: number) {
    const canvas = this.timerCanvas.nativeElement as HTMLCanvasElement;
    const context = canvas.getContext('2d');
    if (!context) {
      console.error('Failed to get 2D context');
      return;
    }
    const radius = canvas.width / 2;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + ((this.totalDuration - remainingTime) / this.totalDuration) * 2 * Math.PI;

    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background circle
    context.beginPath();
    context.arc(centerX, centerY, radius - 10, 0, 2 * Math.PI, false);
    context.fillStyle = '#f3f3f3';
    context.fill();

    // Draw remaining time arc
    context.beginPath();
    context.arc(centerX, centerY, radius - 10, startAngle, endAngle, false);
    context.lineWidth = 20;
    context.strokeStyle = '#007bff';
    context.stroke();

    // Draw center circle
    context.beginPath();
    context.arc(centerX, centerY, radius - 30, 0, 2 * Math.PI, false);
    context.fillStyle = '#ffffff';
    context.fill();

    // Draw remaining time text
    context.fillStyle = '#007bff';
    context.font = '20px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(`${remainingTime}s`, centerX, centerY);
  }

  async showBreakToast() {
    const toast = await this.toastController.create({
      message: `The same exercise will start again in ${this.breakTime} seconds.`,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
    this.startBreakTimer();
  }

  startBreakTimer() {
    this.remainingTime = this.breakTime;
    this.timerRunning = true;
    this.timer = setInterval(() => {
      this.remainingTime--;
      this.drawTimer(this.remainingTime);
      if (this.remainingTime <= 0) {
        clearInterval(this.timer);
        this.remainingTime = this.exerciseDetails.duration;
        this.startTimer();
      }
    }, 1000);
  }

  async showCompletionToast() {
    const toast = await this.toastController.create({
      message: 'Exercise finished',
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
    this.showCompletionPrompt = true; // Show the completion prompt
  }

  markExerciseAsCompleted() {
    this.exerciseDetails.completed = true;
    console.log('Exercise marked as completed:', this.exerciseDetails);
  }

  markExerciseAsCompleted() {
    this.exerciseDetails.completed = true;
    console.log('Exercise marked as completed:', this.exerciseDetails);
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
        console.log('Session marked as completed. Session ID:', this.sessionDetails.sessionId);
      } else {
        console.error('Session ID is undefined');
      }
    } catch (error) {
      console.error('Error marking session as completed:', error);
    }
  }
}
