import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'HostifyCliente',
  webDir: 'www',
  plugins: {
    GoogleMaps: {
      apiKey: ""
    }
  }
};


export default config;
