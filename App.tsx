import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppearanceProvider } from 'react-native-appearance';
import { Main } from './src/main';
import { registerForPushNotificationsAsync } from './src/utils/helper';

export default function App() {

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => console.log("Push Notifcation Token: ",token));
  }, [])

  return (
    <SafeAreaProvider>
      <AppearanceProvider>
        <Main />
      </AppearanceProvider>
    </SafeAreaProvider>
  );
}
