import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Platform } from '@ionic/angular/standalone';
import { AuthService } from './services/auth';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
  standalone: true,
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private authService: AuthService,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.authService.authState.subscribe(isLoggedIn => {
        if (isLoggedIn === true) {
          this.router.navigateByUrl('/tabs/home', { replaceUrl: true });
        } else if (isLoggedIn === false) {
          this.router.navigateByUrl('/login', { replaceUrl: true });
        }
      });
    });
  }
}
