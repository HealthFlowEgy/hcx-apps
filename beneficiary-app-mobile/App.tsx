/**
 * HCX Beneficiary Mobile App
 * React Native Application
 */

import React from 'react';
import {
  StatusBar,
} from 'react-native';
import { RootNavigator } from './src/navigation/RootNavigator';

function App(): JSX.Element {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <RootNavigator />
    </>
  );
}

export default App;
