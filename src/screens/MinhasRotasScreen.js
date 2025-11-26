import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import api from '../services/api';

export default function MinhasRotasScreen({ navigation }) {
  const [favoritos, setFavoritos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  async function carregarFavoritos() {
    try {
      setCarregando(true);
      const response = await api.get('/pontos-favoritos');
      setFavoritos(response.data);
    } catch (err) {
      console.error(err);
      Alert.alert(
        'Erro',
        'Não foi possível carregar seus pontos favoritos.'
      );
    } finally {
      setCarregando(false);
    }
  }

  async function removerFavorito(stopId) {
    try {
      // supondo que o backend siga o padrão /pontos-favoritos/:stopId
      await api.delete(`/pontos-favoritos/${stopId}`);

      setFavoritos((prev) =>
        prev.filter((fav) => fav.stop_id !== stopId)
      );
    } catch (err) {
      console.error(err);
      Alert.alert(
        'Erro',
        'Não foi possível remover este ponto dos favoritos.'
      );
    }
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', carregarFavoritos);
    return unsubscribe;
  }, [navigation]);

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
        data={favoritos}
        keyExtractor={(item) => item.stop_id}
        ListEmptyComponent={
          <Text>Você ainda não tem pontos favoritos.</Text>
        }
        renderItem={({ item }) => (
          <View
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
          >
            {/* ícone padrão do ponto */}
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

            {/* texto + toque para abrir detalhes */}
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() =>
                navigation.navigate('DetalhePonto', {
                  id: item.stop_id,
                  nome: item.name,
                })
              }
            >
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
            </TouchableOpacity>

            {/* botão desfavoritar */}
            <TouchableOpacity
              onPress={() => removerFavorito(item.stop_id)}
              style={{
                marginLeft: 8,
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 999,
                backgroundColor: '#dc2626',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Ionicons
                name="star-outline"
                size={16}
                color="#fff"
              />
              <Text
                style={{
                  marginLeft: 4,
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: '500',
                }}
              >
                Remover
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
