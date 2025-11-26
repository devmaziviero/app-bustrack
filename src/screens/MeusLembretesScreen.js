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

export default function MeusLembretesScreen() {
  const [lembretes, setLembretes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [removendoId, setRemovendoId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const carregarLembretes = useCallback(async () => {
    try {
      setCarregando(true);
      const response = await api.get('/lembretes');
      setLembretes(response.data);
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Não foi possível carregar seus lembretes.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarLembretes();
  }, [carregarLembretes]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await carregarLembretes();
    setRefreshing(false);
  }, [carregarLembretes]);

  async function removerLembrete(id) {
    try {
      setRemovendoId(id);
      await api.delete(`/lembretes/${id}`);
      setLembretes((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Não foi possível remover o lembrete.');
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
        data={lembretes}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text>Você ainda não tem lembretes agendados.</Text>
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
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                backgroundColor: '#16a34a',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}
            >
              <Ionicons name="notifications-outline" size={26} color="#fff" />
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 16,
                  color: '#111827',
                }}
              >
                Ônibus {item.onibus_codigo}
              </Text>
              <Text style={{ color: '#6b7280', fontSize: 12 }}>
                {item.onibus_nome}
              </Text>
              <Text style={{ color: '#4b5563', fontSize: 12, marginTop: 4 }}>
                Ponto: {item.ponto_nome}
              </Text>
              <Text
                style={{
                  color: '#9ca3af',
                  fontSize: 11,
                  marginTop: 4,
                }}
              >
                Lembrar em:{' '}
                {new Date(item.reminder_datetime).toLocaleString()}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => removerLembrete(item.id)}
              disabled={removendoId === item.id}
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
