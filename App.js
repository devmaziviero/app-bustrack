import { NavigationContainer } from '@react-navigation/native';
import { useEffect } from 'react';
import AppNavigator from './src/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { pedirPermissaoNotificacoes } from './src/services/notifications';

export default function App() {
  useEffect(() => {
    pedirPermissaoNotificacoes();
  }, []);

  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
