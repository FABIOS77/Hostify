import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ElementRef, ViewChild, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgZone } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonLabel,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonSkeletonText,
  IonFabButton
} from '@ionic/angular/standalone';
import { Lugar } from 'src/app/models/lugar';
import { addIcons } from 'ionicons';
import { mapOutline, listOutline, sadOutline, arrowBackOutline } from 'ionicons/icons';
import { LugarService } from 'src/app/services/lugar';
import { GoogleMap, Marker } from '@capacitor/google-maps';

@Component({
  selector: 'app-resultados-busqueda',
  templateUrl: './resultados-busqueda.page.html',
  styleUrls: ['./resultados-busqueda.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonLabel,
    IonButton,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonSkeletonText
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ResultadosBusquedaPage implements OnInit, OnDestroy {
  
  @ViewChild('map') mapRef: ElementRef<HTMLElement> | undefined;
  private map: GoogleMap | null = null;
  
  public allResultados: Lugar[] = [];
  public resultados: Lugar[] = [];
  public isLoading = true;
  public vistaMapa = false;
  public defaultImage = 'https://ionicframework.com/docs/img/demos/thumbnail.svg';
  private searchParams: any = null;
  private markerIdToLugarId = new Map<string, number>();
  constructor(
    private lugarService: LugarService,
    private router: Router,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({ mapOutline, listOutline, sadOutline, arrowBackOutline });
  }

  ngOnInit() {
    this.lugarService.resultadosBusqueda$.subscribe(data => {
      this.allResultados = data;
      this.loadInitialData();
      this.isLoading = false;
      this.cdr.markForCheck();
    });
    this.lugarService.ultimosParametrosBusqueda$.subscribe(params => {
      this.searchParams = params;
    });
  }
  ngOnDestroy() {
    this.destroyMap();
  }
  loadInitialData() {
    this.resultados = this.allResultados.slice(0, 10);
  }
  onIonInfinite(ev: any) {
    const currentLength = this.resultados.length;
    
    if (currentLength >= this.allResultados.length) {
      (ev.target as HTMLIonInfiniteScrollElement).disabled = true;
      return;
    }
    setTimeout(() => {
      const nextBatch = this.allResultados.slice(currentLength, currentLength + 10);
      this.resultados = [...this.resultados, ...nextBatch];
      (ev.target as HTMLIonInfiniteScrollElement).complete();
      this.cdr.markForCheck(); 
    }, 500);
  }

  toggleVista() {
    this.vistaMapa = !this.vistaMapa;
  
    if (this.vistaMapa && !this.map) {
      setTimeout(async () => {
        try {
          await this.createMap();
        } catch (e) {
          console.error('Error al crear el mapa', e);
        }
      }, 150);
    } else if (!this.vistaMapa && this.map) {
      this.destroyMap();
    }
  }
  
  async createMap() {
    if (!this.mapRef?.nativeElement) {
      console.error('Map element not found');
      return;
    }
    
    try {
      this.map = await GoogleMap.create({
        id: 'hostify-map',
        element: this.mapRef.nativeElement,
        apiKey: '', 
        config: {
          center: {
            lat: -17.784744,
            lng: -63.180346,
          },
          zoom: 12,
        },
      });
      await this.addMarkers();
    } catch (e) {
      console.error('Error al crear el mapa', e);
      throw e;
    }
  }
  async addMarkers() {
    if (!this.map || this.allResultados.length === 0) {
      return;
    }
    this.markerIdToLugarId.clear();

    const markers: any[] = [];
    const lugaresValidos: Lugar[] = [];
    
    for (const lugar of this.allResultados) {
      const lat = parseFloat(lugar.latitud);
      const lng = parseFloat(lugar.longitud);

      if (!isNaN(lat) && !isNaN(lng)) {
        markers.push({
          title: lugar.nombre, 
          coordinate: {
            lat: lat,
            lng: lng
          }
        });
        lugaresValidos.push(lugar);
        
      } else {
        console.warn('Datos de ubicación no válidos, omitiendo marcador:', lugar);
      }
    }

    if (markers.length > 0) {
      const googleMarkerIds = await this.map.addMarkers(markers);

      googleMarkerIds.forEach((gId, index) => {
        const lugarReal = lugaresValidos[index];
        if (lugarReal) {
          this.markerIdToLugarId.set(gId, lugarReal.id);
        }
      });

      this.escucharClicksEnMarcadores();
    }
  }

  async destroyMap() {
    if (this.map) {
      try {
        await this.map.destroy();
        this.map = null;
      } catch (e) {
        console.error('Error al destruir el mapa', e);
      }
    }
  }

  getPrimeraFoto(lugar: Lugar): string {
    if (lugar.fotos && lugar.fotos.length > 0) {
      const url = lugar.fotos[0].url;
      if (url.startsWith('http')) {
        return url;
      }
      return `${this.lugarService.fileBaseUrl}/${url.replace(/^\//, '')}`;
    }
    return this.defaultImage;
  }

  async escucharClicksEnMarcadores() {
    if (!this.map) return;

    await this.map.setOnMarkerClickListener((event) => {
      const lugarId = this.markerIdToLugarId.get(event.markerId);

      if (lugarId) {
        console.log('Marcador clickeado. Navegando al lugar:', lugarId);
        this.ngZone.run(() => {
          this.verDetalle(lugarId);
        });
      }
    });
  }
  verDetalle(lugarId: number) {
    const queryParams = {
      fechaInicio: this.searchParams?.fecha_llegada || '',
      fechaFin: this.searchParams?.fecha_salida || '',
      cantPersonas: this.searchParams?.cantPersonas || 1
    };
    this.router.navigate(['/detalle-lugar', lugarId], {
      queryParams: queryParams
    });
    this.destroyMap();
  }

  trackById(index: number, item: Lugar) {
    return item.id;
  }
}