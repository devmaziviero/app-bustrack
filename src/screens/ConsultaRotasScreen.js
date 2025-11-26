import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import api from '../services/api';

function formatarDistancia(metros) {
  if (metros == null) return '';
  if (metros >= 1000) {
    const km = metros / 1000;
    return `${km.toFixed(1)} km`;
  }
  return `${Math.round(metros)} m`;
}

export default function ConsultaRotasScreen({ navigation }) {
  const [pontos, setPontos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // const carregarPontos = useCallback(async () => {
  //   try {
  //     const { status } =
  //       await Location.requestForegroundPermissionsAsync();
  //     if (status !== 'granted') {
  //       Alert.alert(
  //         'Permissão negada',
  //         'Precisamos da localização para buscar os pontos próximos.'
  //       );
  //       setPontos([]);
  //       return;
  //     }

  //     const location = await Location.getCurrentPositionAsync({});
  //     // const lat = location.coords.latitude;
  //     // const lng = location.coords.longitude;

  //     const lat = -23.5505;
  //     const lng = -46.6333;
  //     const response = await api.get('/pontos/proximos', {
  //       params: { lat, lng, raio: 1000 },
  //     });

  //     setPontos(response.data);
  //   } catch (err) {
  //     console.error(err);
  //     Alert.alert(
  //       'Erro',
  //       'Não foi possível carregar os pontos próximos.'
  //     );
  //   } finally {
  //     setCarregando(false);
  //   }
  // }, []);

  const carregarPontos = useCallback(async () => {
    try {
      setCarregando(true);

      // 👉 Pula tudo de localização por enquanto
      const lat = -23.5505;
      const lng = -46.6333;

      const response = await api.get('/pontos/proximos', {
        params: { lat, lng, raio: 1000 },
      });

      setPontos(response.data);
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Não foi possível carregar os pontos próximos.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarPontos();
  }, [carregarPontos]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await carregarPontos();
    setRefreshing(false);
  }, [carregarPontos]);

  if (carregando) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#f5f5f5' }}>
      <FlatList
        data={pontos}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text>Nenhum ponto encontrado no raio informado.</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              backgroundColor: '#fff',
              borderRadius: 12,
              padding: 12,
              marginBottom: 10,
              flexDirection: 'row',
              alignItems: 'center',
              elevation: 1,
              shadowColor: '#000',
              shadowOpacity: 0.05,
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 2 },
            }}
            onPress={() =>
              navigation.navigate('DetalhePonto', {
                id: item.id,
                nome: item.name,
              })
            }
          >
            {/* quadrado azul com ícone de ponto */}
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                backgroundColor: '#2563eb',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}
            >
              <Ionicons name="location-outline" size={26} color="#fff" />
            </View>

            {/* texto do ponto */}
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 16,
                  marginBottom: 2,
                  color: '#111827',
                }}
              >
                {item.name}
              </Text>
              {item.description ? (
                <Text style={{ color: '#6b7280', fontSize: 12 }}>
                  {item.description}
                </Text>
              ) : null}
              <Text
                style={{
                  marginTop: 4,
                  color: '#4b5563',
                  fontSize: 12,
                }}
              >
                Distância: {formatarDistancia(item.distancia_metros)}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
