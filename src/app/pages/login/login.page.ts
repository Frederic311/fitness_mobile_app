import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, Users } from 'src/app/services/auth/auth-service.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  ionicForm: FormGroup;

  constructor(
    private toastController: ToastController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private authService: AuthService,
    private router: Router,
    public formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.ionicForm = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
        ],
      ],
      password: ['', [
        Validators.required,
      ]],
    });
  }

  async login() {
    const loading = await this.loadingController.create();
    await loading.present();

    if (this.ionicForm.valid) {
      const user = await this.authService.loginUser(this.ionicForm.value.email, this.ionicForm.value.password).catch((err) => {
        this.presentToast(err);
        console.log(err);
        loading.dismiss();
      });

      if (user) {
        this.authService.fetchUserProfile(user.uid).then((profile: Users | null) => {
          loading.dismiss();
          if (profile?.role === 'Coach') {
            this.router.navigate(['/main-coach']);
          } else {
            this.router.navigate(['/main-user']);
          }
        }).catch(error => {
          console.error('Error fetching user profile:', error);
          loading.dismiss();
          this.presentToast('Error fetching user profile. Please try again.');
        });
      }
    } else {
      loading.dismiss();
      console.log('Please provide all the required values!');
    }
  }

  get errorControl() {
    return this.ionicForm.controls;
  }

  async presentToast(message: string) {
    console.log(message);

    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'top',
    });

    await toast.present();
  }
}
