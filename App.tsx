import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppearanceProvider } from 'react-native-appearance';
import { Main } from './src/main';
import { LogBox } from 'react-native';
import * as Sentry from 'sentry-expo';

LogBox.ignoreLogs(['useNativeDriver', 'Require cycle'])

export default function App() {

  const env = __DEV__ ? 'development' : 'production'
  Sentry.init({
    dsn: 'https://4fbd4f75b7f14083b344bd4d87238d98@o336780.ingest.sentry.io/5732088',
    enableInExpoDevelopment: true,
    environment: env,
    debug: __DEV__ ?? false, // Sentry will try to print out useful debugging information if something goes wrong with sending an event. Set this to `false` in production.
  });


  return (
    <SafeAreaProvider>
      <AppearanceProvider>
        <Main />
      </AppearanceProvider>
    </SafeAreaProvider>
  );
}
