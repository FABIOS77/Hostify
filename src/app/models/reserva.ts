import { Lugar } from "./lugar";

export interface CrearReservaPayload {
  lugar_id: number;
  cliente_id: number;
  fechaInicio: string;  
  fechaFin: string;      
  precioTotal: string;
  precioLimpieza: string;
  precioNoches: string;
  precioServicio: string;
}


export interface MiReserva {
  id: number;
  fechaInicio: string;
  fechaFin: string;
  precioTotal: string;

  precioLimpieza: string;
  precioNoches: string;
  precioServicio: string;

  lugar: Lugar[]; 
  cant_noches?: number; 
}