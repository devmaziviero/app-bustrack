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

export default function OnibusFavoritosScreen({ navigation }) {
  const [favoritos, setFavoritos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [removendoId, setRemovendoId] = useState(null);

  async function carregarFavoritos() {
    try {
      setCarregando(true);
      const response = await api.get('/onibus-favoritos');
      setFavoritos(response.data);
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Não foi possível carregar seus ônibus favoritos.');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', carregarFavoritos);
    return unsubscribe;
  }, [navigation]);

  async function removerFavorito(onibusId) {
    try {
      setRemovendoId(onibusId);
      await api.delete(`/onibus-favoritos/${onibusId}`);
      setFavoritos((prev) =>
        prev.filter((item) => item.onibus_id !== onibusId)
      );
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Não foi possível remover esse ônibus dos favoritos.');
    } finally {
      setRemovendoId(null);
    }
  }

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
        keyExtractor={(item) => item.onibus_id}
        ListEmptyComponent={
          <Text>Você ainda não tem ônibus favoritos.</Text>
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
            {/* quadrado amarelo com ícone de ônibus */}
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                backgroundColor: '#facc15',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}
            >
              <Ionicons name="bus-outline" size={26} color="#fff" />
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 16,
                  color: '#111827',
                }}
              >
                Ônibus {item.codigo}
              </Text>
              <Text style={{ color: '#6b7280', fontSize: 12 }}>
                {item.nome}
              </Text>
              <Text style={{ color: '#9ca3af', fontSize: 11, marginTop: 4 }}>
                Favoritado em: {new Date(item.created_at).toLocaleString()}
              </Text>
            </View>

            {/* botão remover dos favoritos */}
            <TouchableOpacity
              onPress={() => removerFavorito(item.onibus_id)}
              disabled={removendoId === item.onibus_id}
              style={{
                marginLeft: 8,
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 999,
                backgroundColor: '#fee2e2',
              }}
            >
              <Ionicons name="trash-outline" size={18} color="#b91c1c" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
