import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'HostifyCliente',
  webDir: 'www',
  plugins: {
    GoogleMaps: {
      apiKey: "AIzaSyBI0VRZG_WoE0Rndc_UjtT3efA87zSMlWY"
    }
  }
};


export default config;
