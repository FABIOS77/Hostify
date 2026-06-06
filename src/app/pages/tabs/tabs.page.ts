import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { AlertController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { searchOutline, listOutline, logOutOutline } from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth';


@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: true,
  imports: [ IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, CommonModule]
})
export class TabsPage {

  isModalOpen = false;

 constructor(
 
    private authService: AuthService,
    private router: Router,
    private alertCtrl: AlertController,
    
  ) {
  
  addIcons({ searchOutline, listOutline, logOutOutline });
 }


 presentLogoutConfirm() {
  console.log('Abriendo modal custom...');
  this.isModalOpen = true;
}


closeModal() {
  this.isModalOpen = false;
}

  async logout() {
    this.isModalOpen = false;
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}