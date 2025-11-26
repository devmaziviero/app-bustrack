import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from './context/AuthContext';

import CadastroUsuarioScreen from './screens/CadastroUsuarioScreen'; // 👈 novo
import ConsultaRotasScreen from './screens/ConsultaRotasScreen';
import DetalheOnibusPontoScreen from './screens/DetalheOnibusPontoScreen';
import DetalhePontoScreen from './screens/DetalhePontoScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import MeusLembretesScreen from './screens/MeusLembretesScreen';
import MinhasRotasScreen from './screens/MinhasRotasScreen';
import OnibusFavoritosScreen from './screens/OnibusFavoritosScreen';
import SobreAppScreen from './screens/SobreAppScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { usuario, carregando } = useAuth();

  if (carregando) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {usuario ? (
        <>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'BusTrack' }}
          />
          <Stack.Screen
            name="ConsultaRotas"
            component={ConsultaRotasScreen}
            options={{
              title: 'Consulta de Rotas',
              unmountOnBlur: false,  // 👈 mantém a tela montada!
            }}
          />
          <Stack.Screen
            name="MinhasRotas"
            component={MinhasRotasScreen}
            options={{ title: 'Pontos Favoritos' }}
          />
          <Stack.Screen
            name="MeusLembretes"
            component={MeusLembretesScreen}
            options={{ title: 'Meus Lembretes' }}
          />
          <Stack.Screen
            name="OnibusFavoritos"
            component={OnibusFavoritosScreen}
            options={{ title: 'Ônibus Favoritos' }}
          />
          <Stack.Screen
            name="DetalhePonto"
            component={DetalhePontoScreen}
            options={{ title: 'Ônibus do Ponto' }}
          />
          <Stack.Screen
            name="DetalheOnibusPonto"
            component={DetalheOnibusPontoScreen}
            options={{ title: 'Horários do Ônibus' }}
          />
          <Stack.Screen
            name="SobreApp"
            component={SobreAppScreen}
            options={{ title: 'Sobre o BusTrack' }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: 'Login' }}
          />
          <Stack.Screen
            name="CadastroUsuario"
            component={CadastroUsuarioScreen}
            options={{ title: 'Criar conta' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
