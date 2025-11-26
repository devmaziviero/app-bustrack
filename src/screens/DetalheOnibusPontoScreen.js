import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';
import api from '../services/api';
import { agendarNotificacao } from '../services/notifications';

export default function DetalheOnibusPontoScreen({ route }) {
  const {
    pontoId,
    pontoNome,
    onibusId,
    onibusNome,
    onibusCodigo,
    horarios,
    inicialEhFavorito,
  } = route.params;

  const [favorito, setFavorito] = useState(inicialEhFavorito);
  const [salvando, setSalvando] = useState(false);
  const [lembretesPorHorario, setLembretesPorHorario] = useState({});
  const [rota, setRota] = useState([]);
  const [carregandoRota, setCarregandoRota] = useState(true);

  async function alternarFavoritoOnibus() {
    try {
      setSalvando(true);

      if (!favorito) {
        await api.post('/onibus-favoritos', { onibusId });
        setFavorito(true);
      } else {
        await api.delete(`/onibus-favoritos/${onibusId}`);
        setFavorito(false);
      }
    } catch (err) {
      console.error(err);
      Alert.alert(
        'Erro',
        'Não foi possível atualizar o favorito deste ônibus.'
      );
    } finally {
      setSalvando(false);
    }
  }

  // Carregar lembretes desse ônibus + ponto
  useEffect(() => {
    async function carregarLembretes() {
      try {
        const resp = await api.get('/lembretes');
        const mapa = {};
        resp.data.forEach((l) => {
          if (l.ponto_id === pontoId && l.onibus_id === onibusId) {
            // l.horario vem no formato HH:MM:SS
            mapa[l.horario] = l;
          }
        });
        setLembretesPorHorario(mapa);
      } catch (err) {
        console.error(err);
      }
    }

    carregarLembretes();
  }, [pontoId, onibusId]);

  // Carregar rota do ônibus
  useEffect(() => {
    async function carregarRota() {
      try {
        const resp = await api.get(`/onibus/${onibusId}/rota`);
        setRota(resp.data);
      } catch (err) {
        console.error(err);
      } finally {
        setCarregandoRota(false);
      }
    }

    carregarRota();
  }, [onibusId]);

  // se quiser garantir ordenação, ordena aqui também:
  const horariosOrdenados = [...horarios].sort();

  async function alternarLembreteParaHorario(hora) {
    try {
      const jaExiste = lembretesPorHorario[hora];

      if (!jaExiste) {
        // criar
        const resp = await api.post('/lembretes', {
          pontoId,
          pontoNome,
          onibusId,
          onibusNome,
          onibusCodigo,
          horario: hora,
        });

        // agendar notificação local para amanhã nesse horário
        const [h, m] = hora.split(':');
        const agora = new Date();
        const data = new Date(
          agora.getFullYear(),
          agora.getMonth(),
          agora.getDate() + 1,
          Number(h),
          Number(m),
        );

        await agendarNotificacao(
          `Ônibus ${onibusCodigo}`,
          `Seu ônibus parte às ${hora.slice(0, 5)} – não perca!`,
          data
        );

        const novoLembrete = resp.data.lembrete;

        setLembretesPorHorario((prev) => ({
          ...prev,
          [hora]: novoLembrete,
        }));

        Alert.alert(
          'Lembrete criado',
          'Você será notificado amanhã neste horário.'
        );
      } else {
        // remover
        await api.delete(`/lembretes/${jaExiste.id}`);

        setLembretesPorHorario((prev) => {
          const copia = { ...prev };
          delete copia[hora];
          return copia;
        });

        Alert.alert(
          'Lembrete removido',
          'Esse horário não será mais lembrado.'
        );
      }
    } catch (err) {
      console.error(err);
      Alert.alert(
        'Erro',
        'Não foi possível atualizar o lembrete. Tente novamente.'
      );
    }
  }

  function formatHora(hora) {
    if (!hora) return '';
    return hora.slice(0, 5); // de '12:00:00' vira '12:00'
  }

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#f5f5f5' }}>
      {/* Cabeçalho */}
      <View
        style={{
          marginBottom: 16,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: '#111827',
          }}
        >
          Ônibus {onibusCodigo}
        </Text>
        <Text style={{ color: '#6b7280', fontSize: 13 }}>
          {onibusNome}
        </Text>
        <Text style={{ color: '#9ca3af', fontSize: 12, marginTop: 4 }}>
          Ponto: {pontoNome}
        </Text>

        <TouchableOpacity
          onPress={alternarFavoritoOnibus}
          disabled={salvando}
          style={{
            marginTop: 10,
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'flex-start',
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 999,
            backgroundColor: favorito ? '#fbbf24' : '#e5e7eb',
          }}
        >
          <Ionicons
            name={favorito ? 'star' : 'star-outline'}
            size={18}
            color={favorito ? '#92400e' : '#4b5563'}
          />
          <Text
            style={{
              marginLeft: 6,
              fontSize: 12,
              color: favorito ? '#92400e' : '#4b5563',
              fontWeight: '500',
            }}
          >
            {favorito ? 'Ônibus favorito' : 'Favoritar ônibus'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Rota do ônibus */}
      <View
        style={{
          backgroundColor: '#fff',
          borderRadius: 12,
          padding: 12,
          marginBottom: 16,
          elevation: 1,
          shadowColor: '#000',
          shadowOpacity: 0.05,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 2 },
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontWeight: '600',
            color: '#111827',
            marginBottom: 8,
          }}
        >
          Rota deste ônibus
        </Text>

        {carregandoRota ? (
          <ActivityIndicator />
        ) : rota.length === 0 ? (
          <Text style={{ fontSize: 12, color: '#6b7280' }}>
            Nenhuma rota cadastrada para este ônibus.
          </Text>
        ) : (
          rota.map((ponto, index) => (
            <View
              key={`${ponto.stop_id}-${ponto.stop_sequence ?? index}`}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: index === rota.length - 1 ? 0 : 6,
              }}
            >
              <View
                style={{
                  width: 18,
                  alignItems: 'center',
                }}
              >
                {/* bolinha + linha */}
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 999,
                    backgroundColor: '#2563eb',
                  }}
                />
                {index !== rota.length - 1 && (
                  <View
                    style={{
                      width: 2,
                      flex: 1,
                      backgroundColor: '#bfdbfe',
                      marginTop: 2,
                    }}
                  />
                )}
              </View>

              <View style={{ marginLeft: 8 }}>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: '500',
                    color: '#111827',
                  }}
                >
                  {ponto.stop_name}
                </Text>
                {ponto.stop_description && (
                  <Text
                    style={{
                      fontSize: 11,
                      color: '#6b7280',
                    }}
                  >
                    {ponto.stop_description}
                  </Text>
                )}
              </View>
            </View>
          ))
        )}
      </View>

      {/* Lista de horários */}
      <FlatList
        data={horariosOrdenados}
        keyExtractor={(item, index) => `${item}-${index}`}
        ListEmptyComponent={
          <Text>Nenhum horário cadastrado para este ônibus neste ponto.</Text>
        }
        renderItem={({ item }) => {
          const existe = !!lembretesPorHorario[item];

          return (
            <View
              style={{
                backgroundColor: '#fff',
                borderRadius: 10,
                padding: 12,
                marginBottom: 8,
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
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: '#2563eb',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                }}
              >
                <Ionicons name="time-outline" size={22} color="#fff" />
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '500',
                    color: '#111827',
                  }}
                >
                  {item.slice(0, 5)}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => alternarLembreteParaHorario(item)}
                style={{
                  marginLeft: 8,
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 999,
                  backgroundColor: existe ? '#dc2626' : '#16a34a',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Ionicons
                  name={existe ? 'notifications-off-outline' : 'notifications-outline'}
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
                  {existe ? 'Cancelar lembrete' : 'Lembrar amanhã'}
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
}
