export interface Foto {
    id: number;
    url: string;
    lugar_id: number;
  }
  
  export interface Arrendatario {
    id: number;
    nombrecompleto: string;
  }

  export interface Lugar {
    id: number;
    nombre: string;
    descripcion: string;
    cantPersonas: number;
    cantCamas: number;
    cantBanios: number;
    cantHabitaciones: number;
    tieneWifi: number | boolean;
    cantVehiculosParqueo: number;
    precioNoche: string;
    costoLimpieza: string;
    ciudad: string;
    latitud: string;
    longitud: string;
    arrendatario_id: number;
    arrendatario?: Arrendatario;
    fotos?: Foto[];
  }