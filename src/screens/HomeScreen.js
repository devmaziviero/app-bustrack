// src/screens/HomeScreen.js
import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen({ navigation }) {
  const { usuario, logout } = useAuth();

  return (
    <View style={{ flex: 1, padding: 24, backgroundColor: '#f5f5f5' }}>
      {/* Cabeçalho com título, saudação e botão de sair */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24,
        }}
      >
        <View style={{ flexShrink: 1 }}>
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#111827' }}>
            BusTrack
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: '#555',
              marginTop: 4,
            }}
            numberOfLines={1}
          >
            Olá, {usuario?.name || 'usuário'} 👋
          </Text>
        </View>

        {/* Botão de sair (ícone de porta) */}
        <TouchableOpacity
          onPress={logout}
          style={{
            width: 40,
            height: 40,
            borderRadius: 999,
            backgroundColor: '#e5e7eb',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="exit-outline" size={22} color="#374151" />
        </TouchableOpacity>
      </View>

      <Text style={{ fontSize: 14, color: '#555', marginBottom: 24 }}>
        O que você deseja fazer agora?
      </Text>

      {/* Consulta de Rotas */}
      <TouchableOpacity
        style={{
          backgroundColor: '#2563eb',
          paddingVertical: 24,
          paddingHorizontal: 16,
          borderRadius: 12,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
        onPress={() => navigation.navigate('ConsultaRotas')}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="location-outline" size={32} color="#fff" />
          <View style={{ marginLeft: 12 }}>
            <Text
              style={{
                color: '#fff',
                fontSize: 18,
                fontWeight: 'bold',
              }}
            >
              Consulta de Rotas
            </Text>
            <Text style={{ color: '#e0e7ff', fontSize: 12 }}>
              Ver pontos de ônibus perto de você
            </Text>
          </View>
        </View>

        <Ionicons name="chevron-forward" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Pontos Favoritos */}
      <TouchableOpacity
        style={{
          backgroundColor: '#1d4ed8',
          paddingVertical: 24,
          paddingHorizontal: 16,
          borderRadius: 12,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
        onPress={() => navigation.navigate('MinhasRotas')}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="star-outline" size={32} color="#fff" />
          <View style={{ marginLeft: 12 }}>
            <Text
              style={{
                color: '#fff',
                fontSize: 18,
                fontWeight: 'bold',
              }}
            >
              Pontos Favoritos
            </Text>
            <Text style={{ color: '#e0e7ff', fontSize: 12 }}>
              Acesse seus pontos salvos
            </Text>
          </View>
        </View>

        <Ionicons name="chevron-forward" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Ônibus Favoritos */}
      <TouchableOpacity
        style={{
          backgroundColor: '#f59e0b',
          paddingVertical: 24,
          paddingHorizontal: 16,
          borderRadius: 12,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
        onPress={() => navigation.navigate('OnibusFavoritos')}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="bus-outline" size={32} color="#fff" />
          <View style={{ marginLeft: 12 }}>
            <Text
              style={{
                color: '#fff',
                fontSize: 18,
                fontWeight: 'bold',
              }}
            >
              Ônibus Favoritos
            </Text>
            <Text style={{ color: '#fef3c7', fontSize: 12 }}>
              Suas linhas preferidas
            </Text>
          </View>
        </View>

        <Ionicons name="chevron-forward" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Meus Lembretes */}
      <TouchableOpacity
        style={{
          backgroundColor: '#16a34a',
          paddingVertical: 24,
          paddingHorizontal: 16,
          borderRadius: 12,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        onPress={() => navigation.navigate('MeusLembretes')}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="notifications-outline" size={32} color="#fff" />
          <View style={{ marginLeft: 12 }}>
            <Text
              style={{
                color: '#fff',
                fontSize: 18,
                fontWeight: 'bold',
              }}
            >
              Meus Lembretes
            </Text>
            <Text style={{ color: '#dcfce7', fontSize: 12 }}>
              Veja seus lembretes agendados
            </Text>
          </View>
        </View>

        <Ionicons name="chevron-forward" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Link "Sobre o app" */}
      <View style={{ marginTop: 16, alignItems: 'center' }}>
        <TouchableOpacity onPress={() => navigation.navigate('SobreApp')}>
          <Text
            style={{
              fontSize: 13,
              color: '#4b5563',
              textDecorationLine: 'underline',
            }}
          >
            Sobre o aplicativo
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
