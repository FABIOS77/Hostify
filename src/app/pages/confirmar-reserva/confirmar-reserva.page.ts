import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonBackButton,
  IonButtons,
  IonSpinner,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonFooter,
  IonButton,
  IonText
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import { LugarService } from 'src/app/services/lugar';
import { Lugar } from 'src/app/models/lugar';
import { AuthService } from 'src/app/services/auth';
import { ReservaService } from 'src/app/services/reserva';
import { CrearReservaPayload } from 'src/app/models/reserva';


@Component({
  selector: 'app-confirmar-reserva',
  templateUrl: './confirmar-reserva.page.html',
  styleUrls: ['./confirmar-reserva.page.scss'],
  standalone: true,
  imports: [
    IonText,
    IonButton,
    IonFooter,
    IonLabel,
    IonItem,
    IonImg,
    IonSpinner,
    IonButtons,
    IonBackButton,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    DecimalPipe
  ]
})
export class ConfirmarReservaPage implements OnInit {

  public lugar: Lugar | null = null;
  public isLoading = true;
  public isSubmitting = false;

  private lugarId: number | null = null;
  private clienteId: number | null = null;
  public fechaInicio: string = '';
  public fechaFin: string = '';
  public cantNoches: number = 0;
  
  public precioPorNoche: number = 0;
  public precioNochesTotal: number = 0;
  public precioLimpieza: number = 0;
  public precioServicio: number = 0;
  public precioTotal: number = 0;

  private readonly TARIFA_SERVICIO_PORCENTAJE = 0.20; 

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private lugarService: LugarService,
    private reservaService: ReservaService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) {
    addIcons({ chevronBackOutline });
  }
  
  async ngOnInit() {
    try {
      const userIdString = await this.authService.getUserId();
      if (userIdString) {
        this.clienteId = +userIdString; 
      } else {
        throw new Error('No se encontró ID de cliente en storage');
      }
    } catch (e) {
      console.error('Error al obtener el ID del cliente:', e);
      this.router.navigate(['/login']);
      return;
    }
    this.loadReservaData();
  }


  loadReservaData() {
    const idParam = this.route.snapshot.queryParamMap.get('lugarId');
    this.fechaInicio = this.route.snapshot.queryParamMap.get('fechaInicio') || '';
    this.fechaFin = this.route.snapshot.queryParamMap.get('fechaFin') || '';

    if (!idParam || !this.fechaInicio || !this.fechaFin) {
      console.error('Faltan datos para la reserva (ID o fechas)');
      this.isLoading = false;
      this.cdr.markForCheck();
      return;
    }
    this.lugarId = +idParam;

    this.cantNoches = this.calcularNoches(this.fechaInicio, this.fechaFin);
    if (this.cantNoches <= 0) {
      console.error('Rango de fechas inválido');
      this.isLoading = false;
      this.cdr.markForCheck();
      return;
    }

    this.lugarService.getLugarById(this.lugarId).subscribe({
      next: (data) => {
        this.lugar = data;
        
        this.precioPorNoche = parseFloat(data.precioNoche);
        this.precioLimpieza = parseFloat(data.costoLimpieza) || 0;
        
        this.precioNochesTotal = this.precioPorNoche * this.cantNoches;
        this.precioServicio = this.precioNochesTotal * this.TARIFA_SERVICIO_PORCENTAJE;
        this.precioTotal = this.precioNochesTotal + this.precioLimpieza + this.precioServicio;
        
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error al cargar datos del lugar:', err);
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
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
      console.error('Error al calcular noches:', e);
      return 0;
    }
  }
  
  getFullImageUrl(): string {
    if (this.lugar && this.lugar.fotos && this.lugar.fotos.length > 0) {
      const url = this.lugar.fotos[0].url;
      if (url.startsWith('http')) {
        return url;
      }
      return `${this.lugarService.fileBaseUrl}/${url.replace(/^\//, '')}`;
    }
    return 'https://ionicframework.com/docs/img/demos/thumbnail.svg';
  }

  confirmarReserva() {
    if (!this.lugar || this.isSubmitting || !this.clienteId) {
      if(!this.clienteId) {
        console.error('Intento de reserva sin ID de cliente.');
      }
      return;
    }
    this.isSubmitting = true;
    this.cdr.markForCheck();

    const payload: CrearReservaPayload = {
      lugar_id: this.lugar.id,
      cliente_id: this.clienteId,
      fechaInicio: this.fechaInicio,
      fechaFin: this.fechaFin,
      precioTotal: this.precioTotal.toFixed(2),
      precioLimpieza: this.precioLimpieza.toFixed(2),
      precioNoches: this.precioNochesTotal.toFixed(2),
      precioServicio: this.precioServicio.toFixed(2)
    };

    this.reservaService.crearReserva(payload).subscribe({
      next: (response) => {
        console.log('Reserva creada con éxito:', response);
        this.isSubmitting = false;
        this.router.navigate(['/tabs/mis-reservas']);
      },
      error: (err) => {
        console.error('Error al crear la reserva:', err);
        this.isSubmitting = false;
        this.cdr.markForCheck();
      }
    });
  }
}