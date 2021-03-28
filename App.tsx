import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppearanceProvider } from 'react-native-appearance';
import { Main } from './src/main';
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['useNativeDriver', 'Require cycle'])

export default function App() {

  return (
    <SafeAreaProvider>
      <AppearanceProvider>
        <Main />
      </AppearanceProvider>
    </SafeAreaProvider>
  );
}
