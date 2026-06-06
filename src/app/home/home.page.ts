import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonList,
  IonItem,
  IonInput,
  IonButton,
  IonLabel,
  IonToggle,
  IonDatetimeButton,
  IonModal,
  IonDatetime, IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { LugarService } from '../services/lugar';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [ 
    CommonModule,
    FormsModule,
    IonContent,
    IonList,
    IonItem,
    IonInput,
    IonButton,
    IonLabel,
    IonToggle,
    IonDatetimeButton,
    IonModal,
    IonDatetime
  ],
})
export class HomePage {
  
  busquedaAvanzadaActiva = false;
  showDatePickers = false;
  paramsBusqueda: {
    ciudad: string;
    fecha_llegada: string | null;
    fecha_salida: string | null;
    cantHuespedes: number;
    cantCamas: number | null;
    cantBanios: number | null;
    cantHabitaciones: number | null;
    tieneWifi: boolean;
    cantVehiculosParqueo: number | null;
    precioNoche: number | null;
  } = {
    ciudad: '',
    fecha_llegada: null,
    fecha_salida: null,
    cantHuespedes: 1,
    cantCamas: null,
    cantBanios: null,
    cantHabitaciones: null,
    tieneWifi: false,
    cantVehiculosParqueo: null,
    precioNoche: null
  };

  constructor(
    private lugarService: LugarService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit() {
    const today = new Date();
    this.paramsBusqueda.fecha_llegada = today.toISOString(); 
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.paramsBusqueda.fecha_salida = tomorrow.toISOString(); 
    setTimeout(() => {
      this.showDatePickers = true;
    }, 0);
  }
  onDateChange() {
    this.cdr.detectChanges();
  }
  buscar() {
    if (this.busquedaAvanzadaActiva) {
      this.buscarAvanzado();
    } else {
      this.buscarSimple();
    }
  }
  private formatDate(isoString: string | null): string | null {
    if (!isoString) {
      return null;
    }
    try {
      return isoString.split('T')[0];
    } catch (e) {
      console.error('Error formateando fecha:', e);
      return null;
    }
  }
  buscarSimple() {
    const params = {
      ciudad: this.paramsBusqueda.ciudad,
      fecha_llegada: this.formatDate(this.paramsBusqueda.fecha_llegada),
      fecha_salida: this.formatDate(this.paramsBusqueda.fecha_salida),
      cantPersonas: this.paramsBusqueda.cantHuespedes
    };

    this.lugarService.searchLugares(params).subscribe({
      next: (resultados) => {
        this.router.navigate(['/resultados-busqueda']);
      },
      error: (err) => {
        console.error('Error en búsqueda simple:', err);
      }
    });
  }

  buscarAvanzado() {
    const paramsBase = { ...this.paramsBusqueda };
    const apiParams = {
      ...paramsBase,
      fecha_llegada: this.formatDate(this.paramsBusqueda.fecha_llegada),
      fecha_salida: this.formatDate(this.paramsBusqueda.fecha_salida),
      tieneWifi: paramsBase.tieneWifi ? 1 : 0
    };

    this.lugarService.advancedSearchLugares(apiParams).subscribe({
      next: (resultados) => {
        this.router.navigate(['/resultados-busqueda']);
      },
      error: (err) => {
        console.error('Error en búsqueda avanzada:', err);
      }
    });
  }

}