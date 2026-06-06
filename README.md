# HostifyCliente 🏨✈️

¡Bienvenido a **HostifyCliente**! Esta es la aplicación móvil para clientes de **Hostify**, una plataforma moderna de búsqueda y reserva de alojamientos. Desarrollada con **Ionic (Angular Standalone)** y **Capacitor**, ofrece una experiencia móvil rápida, intuitiva y multiplataforma.

---

## 🚀 Características Principales

- 🔍 **Búsqueda de Alojamientos**: Encuentra hospedajes ideales de forma rápida o utiliza los filtros avanzados para afinar tu búsqueda.
- 📍 **Mapa Integrado**: Visualización y localización de alojamientos utilizando la API de **Google Maps**.
- 📅 **Gestión de Reservas**: Confirma nuevas reservas, visualiza tu historial y gestiona tus estadías en tiempo real.
- 🔑 **Autenticación Completa**: Registro de nuevos usuarios, inicio de sesión seguro y gestión de sesión persistente con almacenamiento local.
- 📱 **Diseño Responsivo e Interactivo**: Interfaz móvil optimizada con componentes nativos de Ionic y transiciones fluidas.

---

## 🛠️ Tecnologías Utilizadas

La aplicación está construida sobre un stack moderno y eficiente:

- **Framework Core**: [Ionic 8](https://ionicframework.com/) & [Angular 20](https://angular.dev/) (con componentes Standalone)
- **Ejecución Nativa**: [Capacitor 7](https://capacitorjs.com/) (para despliegue en Android/iOS)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **Estilos**: SCSS / CSS Vanilla con variables personalizadas de Ionic
- **Servicio de Mapas**: `@capacitor/google-maps` (Integración nativa con Google Maps SDK)
- **API Backend**: Consumo de servicios RESTful en `https://airbnbmob2.site/api`

---

## 📁 Estructura del Proyecto

A continuación se detalla la estructura principal del código fuente (`src/app`):

```bash
src/app/
├── components/         # Componentes reutilizables de la interfaz
├── guards/             # Protectores de rutas para controlar el acceso (auth)
├── models/             # Interfaces y modelos de datos (Lugar, Reserva, Usuario)
├── pages/              # Páginas o vistas principales de la aplicación
│   ├── login/          # Pantalla de inicio de sesión
│   ├── registro/       # Pantalla de registro de usuarios
│   ├── home/           # Pantalla principal de búsqueda
│   ├── resultados/     # Listado de resultados filtrados
│   ├── detalle-lugar/  # Información detallada de un hospedaje
│   ├── confirmar/      # Formulario para completar la reserva
│   ├── mis-reservas/   # Listado e historial de reservas del usuario
│   └── tabs/           # Contenedor de navegación principal (Buscar, Reservas, Salir)
├── services/           # Servicios para interactuar con la API (Auth, Lugar, Reserva)
├── app.routes.ts       # Definición y configuración de rutas de Angular
└── app.component.ts    # Componente raíz de la aplicación
```

---

## ⚙️ Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente en tu entorno local:

1. [Node.js](https://nodejs.org/) (versión LTS recomendada, 18+)
2. [Ionic CLI](https://ionicframework.com/docs/intro/cli) (instalación global):
   ```bash
   npm install -g @ionic/cli
   ```
3. [Angular CLI](https://angular.dev/tools/cli) (instalación global):
   ```bash
   npm install -g @angular/cli
   ```
4. [Android Studio](https://developer.android.com/studio) (requerido para compilar y ejecutar en Android)

---

## 💻 Instalación y Configuración

Sigue estos pasos para ejecutar el proyecto de forma local:

### 1. Clonar el Repositorio
```bash
git clone https://github.com/FABIOS77/Hostify.git
cd Hostify
```

### 2. Instalar Dependencias
Instala los paquetes necesarios definidos en el archivo `package.json`:
```bash
npm install
```

### 3. Ejecución en Entorno de Desarrollo (Web)
Para levantar el servidor de desarrollo y probar la aplicación en tu navegador:
```bash
ionic serve
```
El servidor estará disponible por defecto en `http://localhost:8100`.

---

## 🤖 Compilación y Ejecución en Dispositivos Móviles (Android)

Esta aplicación utiliza **Capacitor** para ejecutarse de forma nativa en dispositivos móviles. Sigue estos pasos para compilar en Android:

### 1. Construir el Proyecto Web
Genera los archivos de producción en la carpeta `www`:
```bash
ionic build
```

### 2. Sincronizar Recursos con Capacitor
Copia los recursos web construidos hacia el proyecto nativo de Android:
```bash
npx cap sync
```

### 3. Abrir en Android Studio
Abre el proyecto nativo de Android en Android Studio para compilarlo, depurarlo o generar el APK:
```bash
npx cap open android
```

### 4. Ejecutar Directamente desde la Consola
Si tienes un emulador corriendo o un dispositivo físico conectado con depuración USB activa:
```bash
npx cap run android
```

---

## 🔑 Configuración de Google Maps

La aplicación utiliza la API de Google Maps. La API Key se encuentra configurada en el archivo `capacitor.config.ts`.
Si necesitas utilizar tu propia API Key para desarrollo o producción, modifícala en:

```typescript
const config: CapacitorConfig = {
  // ...
  plugins: {
    GoogleMaps: {
      apiKey: "TU_API_KEY_AQUÍ"
    }
  }
};
```

---

## 👥 Contribuciones y Autoría

Este proyecto forma parte de la plataforma **Hostify**.

- **Desarrollador/Autor**: [FABIOS77](https://github.com/FABIOS77)
- **Repositorio Oficial**: [GitHub - Hostify](https://github.com/FABIOS77/Hostify)
