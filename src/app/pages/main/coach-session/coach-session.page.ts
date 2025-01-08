import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthService, Users, Session, Exercise } from '../../../services/auth/auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-coach-session',
  templateUrl: './coach-session.page.html',
  styleUrls: ['./coach-session.page.scss'],
})
export class CoachSessionPage implements OnInit {
  user: Users | null = null;
  sessions: Session[] = [];
  newSession: Partial<Session> = {
    goal: '',
    startDateTime: new Date(),
    sportType: '',
    exercises: []
  };
  newExercises: Exercise[] = [];
  editingSessionId: string | null = null;
  showCreateSessionForm = false;

  constructor(private authService: AuthService, private router: Router, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.authService.getProfile().then(user => {
      if (user && user.uid) {
        this.authService.fetchUserProfile(user.uid).then(profile => {
          this.user = profile;
          if (this.user && this.user.email) {
            this.loadSessions(this.user.email);
          }
        }).catch(error => {
          console.error('Error fetching user profile:', error);
        });
      }
    }).catch(error => {
      console.error('Error getting user profile:', error);
    });
  }

  loadSessions(coachEmail: string): void {
    this.authService.fetchSessions(coachEmail).then(sessions => {
      this.sessions = sessions;
    }).catch(error => {
      console.error('Error fetching sessions:', error);
    });
  }

  toggleCreateSessionForm(): void {
    this.showCreateSessionForm = !this.showCreateSessionForm;
    this.newExercises = []; // Reset exercises when toggling the form
  }

  async createSession(): Promise<void> {
    try {
      const newSession: Session = {
        coachEmail: this.user!.email,
        goal: this.newSession.goal!,
        startDateTime: this.newSession.startDateTime!,
        sportType: this.newSession.sportType!,
        exercises: this.newExercises,
        status: 'Pending'
      };
      await this.authService.createSession(newSession);
      this.loadSessions(this.user!.email);
      this.newSession = { goal: '', startDateTime: new Date(), sportType: '', exercises: [] };
      this.newExercises = []; // Clear exercises after creating the session
      this.showCreateSessionForm = false;
    } catch (error) {
      console.error('Error creating session:', error);
    }
  }

  addExercise(): void {
    this.newExercises.push({
      exerciseType: '',
      duration: 0,
      repetitions: 0,
      mediaUrl: ''
    });
  }

  removeExercise(index: number): void {
    this.newExercises.splice(index, 1);
  }

  isYouTubeUrl(url: string): boolean {
    return url.includes('youtube.com') || url.includes('youtu.be');
  }

  sanitizeUrl(url: string): SafeResourceUrl {
    // Convertir les URL courtes de YouTube en URL intégrables
    if (this.isYouTubeUrl(url)) {
      url = url.replace('watch?v=', 'embed/');
      url = url.replace('youtu.be/', 'www.youtube.com/embed/');
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  

  handleMediaFile(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      // Create a URL for the selected file and assign it to mediaUrl
      this.newExercises[index].mediaUrl = URL.createObjectURL(file);

      // Store the file for later retrieval (e.g., in localStorage)
      localStorage.setItem(`exercise-${index}-media`, this.newExercises[index].mediaUrl);
    }
  }

  retrieveStoredMedia(): void {
    this.newExercises.forEach((exercise, index) => {
      const storedMediaUrl = localStorage.getItem(`exercise-${index}-media`);
      if (storedMediaUrl) {
        exercise.mediaUrl = storedMediaUrl;
      }
    });
  }

  editSession(session: Session): void {
    this.newSession = { ...session };
    this.newExercises = [...session.exercises];
    this.retrieveStoredMedia(); // Retrieve stored media URLs
    this.editingSessionId = session.sessionId!;
    this.showCreateSessionForm = true;
  }

  async updateSession(): Promise<void> {
    try {
      if (this.editingSessionId) {
        const updatedSession: Partial<Session> = {
          goal: this.newSession.goal!,
          startDateTime: this.newSession.startDateTime!,
          sportType: this.newSession.sportType!,
          exercises: this.newExercises
        };
        await this.authService.updateSession(this.editingSessionId, updatedSession);
        this.loadSessions(this.user!.email);
        this.editingSessionId = null;
        this.newSession = { goal: '', startDateTime: new Date(), sportType: '', exercises: [] };
        this.newExercises = [];
        this.showCreateSessionForm = false;
      }
    } catch (error) {
      console.error('Error updating session:', error);
    }
  }

  async deleteSession(sessionId: string): Promise<void> {
    try {
      await this.authService.deleteSession(sessionId);
      this.loadSessions(this.user!.email);
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  }

  goBack(): void {
    this.router.navigate(['main-coach']); // Update with the correct route or logic for navigation
  }
}
