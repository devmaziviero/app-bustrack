import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const navigation = useNavigation();
  const { login } = useAuth();
  const [email, setEmail] = useState('enzo@example.com');
  const [senha, setSenha] = useState('123456');
  const [carregando, setCarregando] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  // async function handleLogin() {
  //   try {
  //     setCarregando(true);
  //     await login(email, senha);
  //   } catch (err) {
  //     console.error(err);

  //     const backendMsg = err.response?.data?.error;
  //     const status = err.response?.status;

  //     Alert.alert(
  //       'Erro no login',
  //       backendMsg
  //         ? `Status: ${status}\nMensagem: ${backendMsg}`
  //         : `Tipo: ${err.name}\nMensagem: ${err.message}`
  //     );
  //   } finally {
  //     setCarregando(false);
  //   }
  // }

  async function handleLogin() {
    try {
      setCarregando(true);
      await login(email, senha);
    } catch (err) {
      console.error('ERRO NO LOGIN 👉', err);

      // Tenta extrair o máximo de info possível
      const status = err.response?.status;
      const url = err.config?.url;
      const method = err.config?.method;
      const baseURL = err.config?.baseURL;
      const data = err.response?.data;

      let mensagem = '';

      if (status) {
        mensagem += `Status: ${status}\n`;
      }

      if (data) {
        try {
          mensagem += `Resposta: ${JSON.stringify(data)}\n`;
        } catch {
          mensagem += `Resposta: ${String(data)}\n`;
        }
      }

      if (url || method || baseURL) {
        mensagem += `\n[Request]\n`;
        if (method) mensagem += `Método: ${method.toUpperCase()}\n`;
        if (baseURL) mensagem += `BaseURL: ${baseURL}\n`;
        if (url) mensagem += `URL: ${url}\n`;
      }

      if (!mensagem) {
        // Caso típico de Network Error
        mensagem = `Tipo: ${err.name}\nMensagem: ${err.message}`;
      }

      Alert.alert('Erro no login', mensagem);
    } finally {
      setCarregando(false);
    }
  }

  function irParaCadastro() {
    navigation.navigate('CadastroUsuario');
  }

  return (
    <LinearGradient
      colors={['#1d4ed8', '#2563eb', '#60a5fa']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View
          style={{
            flex: 1,
            paddingHorizontal: 24,
            justifyContent: 'center',
            backgroundColor: 'rgba(255,255,255,0.06)',
          }}
        >
          {/* Cabeçalho / logo */}
          <View style={{ alignItems: 'center', marginBottom: 32 }}>
            <View
              style={{
                width: 68,
                height: 68,
                borderRadius: 24,
                backgroundColor: 'rgba(15,23,42,0.9)',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12,
              }}
            >
              <Ionicons name="bus-outline" size={34} color="#fff" />
            </View>
            <Text
              style={{
                fontSize: 26,
                fontWeight: 'bold',
                color: '#f9fafb',
              }}
            >
              BusTrack
            </Text>
            <Text
              style={{
                marginTop: 4,
                fontSize: 13,
                color: '#e5e7eb',
                textAlign: 'center',
              }}
            >
              Acompanhe seus pontos e horários de ônibus em tempo real.
            </Text>
          </View>

          {/* Card de login */}
          <View
            style={{
              backgroundColor: '#f9fafb',
              borderRadius: 16,
              padding: 20,
              elevation: 3,
              shadowColor: '#000',
              shadowOpacity: 0.12,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 6 },
            }}
          >
            {/* Campo e-mail */}
            <Text
              style={{
                fontSize: 13,
                fontWeight: '500',
                color: '#4b5563',
                marginBottom: 4,
              }}
            >
              E-mail
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: '#e5e7eb',
                borderRadius: 10,
                paddingHorizontal: 10,
                marginBottom: 14,
                backgroundColor: '#f3f4f6',
              }}
            >
              <Ionicons name="mail-outline" size={18} color="#6b7280" />
              <TextInput
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="seuemail@exemplo.com"
                placeholderTextColor="#9ca3af"
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  marginLeft: 8,
                  fontSize: 14,
                  color: '#111827',
                }}
              />
            </View>

            {/* Campo senha */}
            <Text
              style={{
                fontSize: 13,
                fontWeight: '500',
                color: '#4b5563',
                marginBottom: 4,
              }}
            >
              Senha
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: '#e5e7eb',
                borderRadius: 10,
                paddingHorizontal: 10,
                backgroundColor: '#f3f4f6',
              }}
            >
              <Ionicons name="lock-closed-outline" size={18} color="#6b7280" />
              <TextInput
                value={senha}
                onChangeText={setSenha}
                secureTextEntry={!mostrarSenha}
                placeholder="Sua senha"
                placeholderTextColor="#9ca3af"
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  marginLeft: 8,
                  fontSize: 14,
                  color: '#111827',
                }}
              />
              <TouchableOpacity
                onPress={() => setMostrarSenha((prev) => !prev)}
                style={{ padding: 4 }}
              >
                <Ionicons
                  name={mostrarSenha ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#6b7280"
                />
              </TouchableOpacity>
            </View>

            {/* Botão entrar */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={carregando}
              style={{
                marginTop: 20,
                backgroundColor: carregando ? '#93c5fd' : '#2563eb',
                paddingVertical: 12,
                borderRadius: 999,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
              }}
            >
              {carregando ? (
                <>
                  <ActivityIndicator color="#fff" />
                  <Text
                    style={{
                      color: '#fff',
                      fontWeight: '600',
                      marginLeft: 8,
                    }}
                  >
                    Entrando...
                  </Text>
                </>
              ) : (
                <>
                  <Ionicons name="log-in-outline" size={18} color="#fff" />
                  <Text
                    style={{
                      color: '#fff',
                      fontWeight: '600',
                      marginLeft: 8,
                      fontSize: 15,
                    }}
                  >
                    Entrar
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Link Criar conta */}
          <View style={{ marginTop: 16, alignItems: 'center' }}>
            <TouchableOpacity onPress={irParaCadastro}>
              <Text
                style={{
                  fontSize: 13,
                  color: '#f9fafb',
                  textDecorationLine: 'underline',
                  fontWeight: '500',
                }}
              >
                Criar uma conta
              </Text>
            </TouchableOpacity>

            <Text style={{ fontSize: 12, color: '#e5e7eb', marginTop: 6 }}>
              Uso exclusivo dos passageiros cadastrados.
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
