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

function calcularProximoHorario(horarios) {
  if (!horarios || horarios.length === 0) return null;

  const agora = new Date();
  const minutosAgora = agora.getHours() * 60 + agora.getMinutes();

  let proximo = null;

  horarios.forEach((horaStr) => {
    if (!horaStr) return;
    const [h, m] = horaStr.split(':');
    const minutos = Number(h) * 60 + Number(m);

    if (minutos >= minutosAgora) {
      if (!proximo || minutos < proximo.minutos) {
        proximo = { minutos, horaFormatada: horaStr.slice(0, 5) };
      }
    }
  });

  return proximo ? proximo.horaFormatada : null;
}

export default function DetalhePontoScreen({ route, navigation }) {
  const { id, nome } = route.params;

  const [onibusLista, setOnibusLista] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const [favoritoPonto, setFavoritoPonto] = useState(false);
  const [salvandoFavoritoPonto, setSalvandoFavoritoPonto] = useState(false);

  const [favoritosOnibusIds, setFavoritosOnibusIds] = useState([]);
  const [salvandoOnibusId, setSalvandoOnibusId] = useState(null);

  // Carrega horários do ponto e agrupa por ônibus
  useEffect(() => {
    async function carregarOnibusDoPonto() {
      try {
        const response = await api.get(`/pontos/${id}/horarios`);
        const linhas = response.data;

        // agrupar por onibus_id
        const agrupado = {};
        linhas.forEach((linha) => {
          const key = linha.onibus_id;
          if (!agrupado[key]) {
            agrupado[key] = {
              onibus_id: linha.onibus_id,
              onibus_nome: linha.onibus_nome,
              onibus_codigo: linha.onibus_codigo,
              horarios: [],
            };
          }
          agrupado[key].horarios.push(linha.horario);
        });

        const lista = Object.values(agrupado).map((item) => {
          // ordenar horários apenas pra ficar mais bonitinho
          const horariosOrdenados = [...item.horarios].sort();
          return { ...item, horarios: horariosOrdenados };
        });

        setOnibusLista(lista);
      } catch (err) {
        console.error(err);
        Alert.alert(
          'Erro',
          'Não foi possível carregar os ônibus deste ponto.'
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarOnibusDoPonto();
  }, [id]);

  // Verifica se o ponto já é favorito
  useEffect(() => {
    async function verificarFavoritoPonto() {
      try {
        const response = await api.get('/pontos-favoritos');
        const jaFavorito = response.data.some(
          (item) => item.stop_id === id
        );
        setFavoritoPonto(jaFavorito);
      } catch (err) {
        console.error(err);
      }
    }

    verificarFavoritoPonto();
  }, [id]);

  // Carrega ônibus favoritos do usuário
  useEffect(() => {
    async function carregarOnibusFavoritos() {
      try {
        const response = await api.get('/onibus-favoritos');
        const ids = response.data.map((item) => item.onibus_id);
        setFavoritosOnibusIds(ids);
      } catch (err) {
        console.error(err);
      }
    }

    carregarOnibusFavoritos();
  }, []);

  async function alternarFavoritoPonto() {
    try {
      setSalvandoFavoritoPonto(true);

      if (!favoritoPonto) {
        await api.post('/pontos-favoritos', { stopId: id });
        setFavoritoPonto(true);
        Alert.alert('Ponto favoritado', 'Esse ponto foi salvo nos seus favoritos.');
      } else {
        await api.delete(`/pontos-favoritos/${id}`);
        setFavoritoPonto(false);
        Alert.alert(
          'Ponto removido',
          'Esse ponto foi removido dos seus favoritos.'
        );
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Não foi possível atualizar o favorito deste ponto.');
    } finally {
      setSalvandoFavoritoPonto(false);
    }
  }

  async function alternarFavoritoOnibus(onibusId) {
    try {
      setSalvandoOnibusId(onibusId);

      const jaFavorito = favoritosOnibusIds.includes(onibusId);

      if (!jaFavorito) {
        await api.post('/onibus-favoritos', { onibusId });
        setFavoritosOnibusIds((prev) => [...prev, onibusId]);
      } else {
        await api.delete(`/onibus-favoritos/${onibusId}`);
        setFavoritosOnibusIds((prev) =>
          prev.filter((idFavorito) => idFavorito !== onibusId)
        );
      }
    } catch (err) {
      console.error(err);
      Alert.alert(
        'Erro',
        'Não foi possível atualizar o favorito deste ônibus.'
      );
    } finally {
      setSalvandoOnibusId(null);
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
      {/* Cabeçalho com botão de favoritar ponto */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#111827',
            }}
          >
            {nome}
          </Text>
          <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>
            Ônibus disponíveis neste ponto
          </Text>
        </View>

        <TouchableOpacity
          onPress={alternarFavoritoPonto}
          disabled={salvandoFavoritoPonto}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 999,
            backgroundColor: favoritoPonto ? '#fbbf24' : '#e5e7eb',
          }}
        >
          <Ionicons
            name={favoritoPonto ? 'star' : 'star-outline'}
            size={18}
            color={favoritoPonto ? '#92400e' : '#4b5563'}
          />
          <Text
            style={{
              marginLeft: 6,
              fontSize: 12,
              color: favoritoPonto ? '#92400e' : '#4b5563',
              fontWeight: '500',
            }}
          >
            {favoritoPonto ? 'Ponto favorito' : 'Favoritar ponto'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={onibusLista}
        keyExtractor={(item) => item.onibus_id}
        ListEmptyComponent={
          <Text>Nenhum ônibus cadastrado para este ponto.</Text>
        }
        renderItem={({ item }) => {
          const ehFavorito = favoritosOnibusIds.includes(item.onibus_id);

          return (
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
                navigation.navigate('DetalheOnibusPonto', {
                  pontoId: id,
                  pontoNome: nome,
                  onibusId: item.onibus_id,
                  onibusNome: item.onibus_nome,
                  onibusCodigo: item.onibus_codigo,
                  horarios: item.horarios,
                  inicialEhFavorito: ehFavorito,
                })
              }
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
                  Ônibus {item.onibus_codigo}
                </Text>
                <Text style={{ color: '#6b7280', fontSize: 12 }}>
                  {item.onibus_nome}
                </Text>
                <Text
                  style={{
                    marginTop: 4,
                    color: '#4b5563',
                    fontSize: 12,
                  }}
                >
                  {item.horarios.length} horário(s) neste ponto
                </Text>

                <Text
                  style={{
                    marginTop: 2,
                    color: '#6b7280',
                    fontSize: 12,
                  }}
                >
                  Próximo horário:{' '}
                  {calcularProximoHorario(item.horarios) || 'sem próximos hoje'}
                </Text>
              </View>

              {/* Estrela de favorito do ônibus */}
              <TouchableOpacity
                onPress={() => alternarFavoritoOnibus(item.onibus_id)}
                disabled={salvandoOnibusId === item.onibus_id}
                style={{
                  marginLeft: 8,
                  padding: 6,
                  borderRadius: 999,
                  backgroundColor: ehFavorito ? '#fbbf24' : '#e5e7eb',
                }}
              >
                <Ionicons
                  name={ehFavorito ? 'star' : 'star-outline'}
                  size={18}
                  color={ehFavorito ? '#92400e' : '#4b5563'}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}
