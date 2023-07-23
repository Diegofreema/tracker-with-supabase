import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';

import Main from './Main';
import AuthContextProvider from './AuthContext';

export default function App() {
  return (
    <AuthContextProvider>
      <StatusBar style="auto" />
      <Main />
    </AuthContextProvider>
  );
}
