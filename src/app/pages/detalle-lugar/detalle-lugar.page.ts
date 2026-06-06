import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
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
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonLabel,
  IonButton,
  IonFooter,
  IonText
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  bedOutline,
  bodyOutline,
  carSportOutline,
  wifiOutline,
  keyOutline,
  waterOutline
} from 'ionicons/icons';
import { LugarService } from 'src/app/services/lugar';
import { Lugar, Foto } from 'src/app/models/lugar';

@Component({
  selector: 'app-detalle-lugar',
  templateUrl: './detalle-lugar.page.html',
  styleUrls: ['./detalle-lugar.page.scss'],
  standalone: true,
  imports: [
    IonText,
    IonFooter,
    IonButton,
    IonLabel,
    IonIcon,
    IonCol,
    IonRow,
    IonGrid,
    IonImg,
    IonSpinner,
    IonButtons,
    IonBackButton,
    IonContent,
    IonHeader,
    IonToolbar,
    CommonModule,
    FormsModule,
    DecimalPipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetalleLugarPage implements OnInit {

  public lugar: Lugar | null = null;
  public isLoading = true;
  public fotoSeleccionadaUrl: string = '';
  public defaultImage = 'https://ionicframework.com/docs/img/demos/thumbnail.svg';

  private lugarId: number | null = null;
  private fechaInicio: string | null = null;
  private fechaFin: string | null = null;
  private cantPersonas: number = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private lugarService: LugarService,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({
      chevronBackOutline,
      bedOutline,
      bodyOutline,
      carSportOutline,
      wifiOutline,
      keyOutline,
      waterOutline
    });
  }

  ngOnInit() {
    this.loadLugarData();
  }

  loadLugarData() {
    const idParam = this.route.snapshot.paramMap.get('id');
    
    if (!idParam) {
      this.isLoading = false;
      console.error('No se encontró el ID del lugar');
      this.cdr.markForCheck();
      return;
    }

    this.lugarId = +idParam;
    this.fechaInicio = this.route.snapshot.queryParamMap.get('fechaInicio');
    this.fechaFin = this.route.snapshot.queryParamMap.get('fechaFin');
    this.cantPersonas = +(this.route.snapshot.queryParamMap.get('cantPersonas') || '1');
    

    console.log('Datos leídos de la URL:', {
      lugarId: this.lugarId,
      fechaInicio: this.fechaInicio,
      fechaFin: this.fechaFin
    });


    this.lugarService.getLugarById(this.lugarId).subscribe({
      next: (data) => {
        this.lugar = data;
        if (data.fotos && data.fotos.length > 0) {
          this.fotoSeleccionadaUrl = this.getFullImageUrl(data.fotos[0].url);
        } else {
          this.fotoSeleccionadaUrl = this.defaultImage;
        }
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error al cargar el lugar:', err);
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  getFullImageUrl(url?: string): string {
    if (!url) {
      return this.defaultImage;
    }
    if (url.startsWith('http')) {
      return url;
    }
    return `${this.lugarService.fileBaseUrl}/${url.replace(/^\//, '')}`;
  }

  seleccionarFoto(foto: Foto) {
    this.fotoSeleccionadaUrl = this.getFullImageUrl(foto.url);
    this.cdr.markForCheck();
  }

  irAReservar() {
    const queryParams = {
      lugarId: this.lugarId,
      fechaInicio: this.fechaInicio,
      fechaFin: this.fechaFin,
      cantPersonas: this.cantPersonas
    };
    
    console.log('Navegando a /confirmar-reserva con:', queryParams);
    
    this.router.navigate(['/confirmar-reserva'], { queryParams });
  }
}