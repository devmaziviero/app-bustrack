// src/screens/SobreAppScreen.js
import { Ionicons } from '@expo/vector-icons';
import { ScrollView, Text, View } from 'react-native';

export default function SobreAppScreen() {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#eff2ff' }}
      contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
    >
      {/* Cabeçalho */}
      <View
        style={{
          alignItems: 'center',
          marginBottom: 24,
          marginTop: 8,
        }}
      >
        <View
          style={{
            width: 72,
            height: 72,
            borderRadius: 24,
            backgroundColor: '#2563eb',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 10,
          }}
        >
          <Ionicons name="bus-outline" size={38} color="#fff" />
        </View>

        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: '#111827',
          }}
        >
          BusTrack
        </Text>
        <Text
          style={{
            marginTop: 4,
            fontSize: 13,
            color: '#4b5563',
            textAlign: 'center',
          }}
        >
          Versão 1.0 · Trabalho acadêmico
        </Text>
      </View>

      {/* Card: Sobre o aplicativo */}
      <View
        style={{
          backgroundColor: '#fff',
          borderRadius: 14,
          padding: 16,
          marginBottom: 12,
          elevation: 1,
          shadowColor: '#000',
          shadowOpacity: 0.06,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 3 },
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: '600',
            color: '#111827',
            marginBottom: 6,
          }}
        >
          Sobre o aplicativo
        </Text>
        <Text
          style={{
            fontSize: 13,
            color: '#4b5563',
            lineHeight: 18,
          }}
        >
          O BusTrack é um aplicativo mobile desenvolvido para auxiliar
          passageiros no acompanhamento de pontos de ônibus, linhas
          favoritas, horários e lembretes de saída, oferecendo uma
          experiência mais organizada e segura no dia a dia.
        </Text>
      </View>

      {/* Card: Funcionalidades principais */}
      <View
        style={{
          backgroundColor: '#fff',
          borderRadius: 14,
          padding: 16,
          marginBottom: 12,
          elevation: 1,
          shadowColor: '#000',
          shadowOpacity: 0.06,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 3 },
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: '600',
            color: '#111827',
            marginBottom: 6,
          }}
        >
          Funcionalidades principais
        </Text>

        <View style={{ marginTop: 4 }}>
          <ItemBullet texto="Consulta de pontos próximos à localização do usuário." />
          <ItemBullet texto="Visualização dos ônibus que atendem cada ponto." />
          <ItemBullet texto="Marcação de pontos e linhas de ônibus favoritas." />
          <ItemBullet texto="Agendamento de lembretes para horários específicos." />
          <ItemBullet texto="Login com autenticação via token (JWT)." />
        </View>
      </View>

      {/* Card: Tecnologias utilizadas */}
      <View
        style={{
          backgroundColor: '#fff',
          borderRadius: 14,
          padding: 16,
          marginBottom: 12,
          elevation: 1,
          shadowColor: '#000',
          shadowOpacity: 0.06,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 3 },
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: '600',
            color: '#111827',
            marginBottom: 6,
          }}
        >
          Tecnologias utilizadas
        </Text>

        <View style={{ marginTop: 4 }}>
          <ItemBullet texto="React Native com Expo (frontend mobile)." />
          <ItemBullet texto="Node.js com Express (API backend)." />
          <ItemBullet texto="PostgreSQL (banco de dados relacional)." />
          <ItemBullet texto="JWT (JSON Web Token) para autenticação." />
          <ItemBullet texto="Expo Location para acesso à localização do usuário." />
          <ItemBullet texto="Expo Notifications para lembretes locais." />
        </View>
      </View>

      {/* Card: Autoria / contexto acadêmico */}
      <View
        style={{
          backgroundColor: '#fff',
          borderRadius: 14,
          padding: 16,
          marginBottom: 12,
          elevation: 1,
          shadowColor: '#000',
          shadowOpacity: 0.06,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 3 },
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: '600',
            color: '#111827',
            marginBottom: 6,
          }}
        >
          Autoria e contexto
        </Text>

        <Text
          style={{
            fontSize: 13,
            color: '#4b5563',
            lineHeight: 18,
          }}
        >
          Este aplicativo foi desenvolvido como parte de um trabalho
          acadêmico, com foco em experiência do usuário (UX), boas
          práticas de desenvolvimento mobile e integração com serviços
          de backend e banco de dados.
        </Text>

        <Text
          style={{
            marginTop: 10,
            fontSize: 13,
            color: '#4b5563',
          }}
        >
          Autora: Enzo Maziviero
        </Text>
      </View>
    </ScrollView>
  );
}

// Componente interno para bullet
function ItemBullet({ texto }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 4,
      }}
    >
      <Text
        style={{
          fontSize: 10,
          marginTop: 4,
          marginRight: 6,
          color: '#2563eb',
        }}
      >
        •
      </Text>
      <Text
        style={{
          fontSize: 13,
          color: '#4b5563',
          flex: 1,
        }}
      >
        {texto}
      </Text>
    </View>
  );
}
