import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./pages/forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'verify',
    loadChildren: () => import('./pages/verify/verify.module').then( m => m.VerifyPageModule)
  },
  {
    path: 'landing',
    loadChildren: () => import('./pages/landing/landing.module').then( m => m.LandingPageModule)
  },
  {
    path: 'confirmation',
    loadChildren: () => import('./pages/confirmation/confirmation.module').then( m => m.ConfirmationPageModule)
  },
  {
    path: 'journals',
    loadChildren: () => import('./pages/journals/journals.module').then( m => m.JournalsPageModule)
  },
  {
    path: 'journal',
    loadChildren: () => import('./pages/journal/journal.module').then( m => m.JournalPageModule)
  },
  {
    path: 'splash',
    loadChildren: () => import('./pages/splashes/splash/splash.module').then( m => m.SplashPageModule)
  },
  {
    path: 'workout1',
    loadChildren: () => import('./pages/splashes/workout1/workout1.module').then( m => m.Workout1PageModule)
  },
  {
    path: 'workout2',
    loadChildren: () => import('./pages/splashes/workout2/workout2.module').then( m => m.Workout2PageModule)
  },
  {
    path: 'perso',
    loadChildren: () => import('./pages/info/perso/perso.module').then( m => m.PersoPageModule)
  },
  {
    path: 'role',
    loadChildren: () => import('./pages/info/role/role.module').then( m => m.RolePageModule)
  },

  {
    path: 'description',
    loadChildren: () => import('./pages/info/description/description.module').then( m => m.DescriptionPageModule)
  },
  {
    path: 'level',
    loadChildren: () => import('./pages/level/level.module').then( m => m.LevelPageModule)
  },
  {
    path: 'banner',
    loadChildren: () => import('./pages/info/banner/banner.module').then( m => m.BannerPageModule)
  },  {
    path: 'main-user',
    loadChildren: () => import('./pages/main/main-user/main-user.module').then( m => m.MainUserPageModule)
  },
  {
    path: 'main-coach',
    loadChildren: () => import('./pages/main/main-coach/main-coach.module').then( m => m.MainCoachPageModule)
  },
  {
    path: 'coach-session',
    loadChildren: () => import('./pages/main/coach-session/coach-session.module').then( m => m.CoachSessionPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./pages/main/tabs/tabs.module').then( m => m.TabsPageModule)
  },
  {
    path: 'to-do',
    loadChildren: () => import('./pages/main/to-do/to-do.module').then( m => m.ToDoPageModule)
  },






  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
