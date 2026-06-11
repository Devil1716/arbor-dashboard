import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.arbor.dashboard',
  appName: 'arbor-dashboard',
  webDir: 'dist',
  server: {
    cleartext: true
  }
};

export default config;
