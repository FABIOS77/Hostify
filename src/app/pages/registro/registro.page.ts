import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  ToastController,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonItem,
  IonInput,
  IonText,
  IonButton,
  IonSpinner,
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth';
@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonItem,
    IonInput,
    IonButton,
    IonSpinner,
    IonText,
  ],
})
export class RegistroPage implements OnInit {
  registroForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastCtrl: ToastController
  ) {
    this.registroForm = this.fb.group({
      nombrecompleto: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {}

  async onRegistro() {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const datosRegistro = this.registroForm.value;

    this.authService.registro(datosRegistro).subscribe({
      next: (res) => {
        this.isLoading = false;
        console.log('Registro exitoso', res);
        this.mostrarError('¡Registro exitoso! Ahora puedes iniciar sesión.', 'success');
        this.router.navigateByUrl('/login');
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error en registro', err);
        this.mostrarError('Error al registrarse. Prueba con otro email.');
      },
    });
  }

  async mostrarError(mensaje: string, color: 'danger' | 'success' = 'danger') {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 3000,
      color: color,
    });
    toast.present();
  }
}