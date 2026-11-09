import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.freshbasket.app',
  appName: 'FreshBasket',
  webDir: 'build',
  server: {
    androidScheme: 'http'
  }
};

export default config;
