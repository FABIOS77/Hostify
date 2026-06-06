import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonSpinner,
  IonIcon,
  IonImg,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonRefresher,
  IonRefresherContent
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { calendarOutline, cashOutline, homeOutline, sadOutline, personOutline } from 'ionicons/icons';
import { MiReserva } from 'src/app/models/reserva';
import { AuthService } from 'src/app/services/auth';
import { ReservaService } from 'src/app/services/reserva';
import { LugarService } from 'src/app/services/lugar';



@Component({
  selector: 'app-mis-reservas',
  templateUrl: './mis-reservas.page.html',
  styleUrls: ['./mis-reservas.page.scss'],
  standalone: true,
  imports: [
    IonRefresher, IonRefresherContent,
    IonCardTitle, IonCardHeader, IonCardContent, IonCard, IonImg, IonIcon,
    IonSpinner, IonLabel, IonItem, IonList, IonContent, IonHeader,
    IonTitle, IonToolbar, CommonModule, FormsModule, DatePipe
  ]
})
export class MisReservasPage implements OnInit {

  public misReservas: MiReserva[] = [];
  public isLoading = true;
  public defaultImage = 'https://ionicframework.com/docs/img/demos/thumbnail.svg';
  public fileBaseUrl: string;

  constructor(
    private authService: AuthService,
    private reservaService: ReservaService,
    private lugarService: LugarService,
    private cdr: ChangeDetectorRef
  ) {
    this.fileBaseUrl = this.lugarService.fileBaseUrl;
    addIcons({ calendarOutline, cashOutline, homeOutline, sadOutline, personOutline });
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.loadReservas();
  }

  async loadReservas(event?: any) {
    if (!event) { 
      this.isLoading = true;
      this.cdr.markForCheck();
    }

    try {
      const clienteIdStr = await this.authService.getUserId();
      if (!clienteIdStr) {
        throw new Error('no se pudo obtener el ID del cliente');
      }
      const clienteId = +clienteIdStr;

      this.reservaService.getReservasByClienteId(clienteId).subscribe({
        next: (data) => {
          console.log('datos de reservas recibidos:', data);
          this.misReservas = data;
          this.isLoading = false;
          if (event) event.target.complete();
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Error al cargar reservas:', err);
          this.isLoading = false;
          if (event) event.target.complete();
          this.cdr.markForCheck();
        }
      });
    } catch (error) {
      console.error('Error al obtener ID de cliente:', error);
      this.isLoading = false;
      if (event) event.target.complete();
      this.cdr.markForCheck();
    }
  }


  getReservaFotoUrl(reserva: MiReserva): string {
    if (!reserva.lugar || reserva.lugar.length === 0) {
      return this.defaultImage;
    }
    
    const lugar = reserva.lugar[0];

    if (lugar.fotos && lugar.fotos.length > 0) {
      const url = lugar.fotos[0].url;
      if (url.startsWith('http')) {
        return url;
      }
      return `${this.fileBaseUrl}/${url.replace(/^\//, '')}`;
    }

    return this.defaultImage;
  }
  
  handleRefresh(event: any) {
    this.loadReservas(event);
  }

 
  calcularNoches(inicio: string, fin: string): number {
    try {
      const fechaInicio = new Date(inicio);
      const fechaFin = new Date(fin);
      fechaInicio.setMinutes(fechaInicio.getMinutes() + fechaInicio.getTimezoneOffset());
      fechaFin.setMinutes(fechaFin.getMinutes() + fechaFin.getTimezoneOffset());
      
      const diffTime = Math.abs(fechaFin.getTime() - fechaInicio.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      return diffDays > 0 ? diffDays : 0;
    } catch (e) {
      return 0;
    }
  }
}