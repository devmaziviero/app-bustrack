import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    Alert,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import api from '../services/api';

export default function CadastroUsuarioScreen({ navigation }) {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [carregando, setCarregando] = useState(false);

    async function handleCadastro() {
        try {
            setCarregando(true);

            const resp = await api.post('/auth/register', {
                name: nome,
                email,
                password: senha,
            });

            Alert.alert(
                'Sucesso',
                'Conta criada com sucesso! Agora faça login.',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack(),
                    },
                ]
            );
        } catch (err) {
            console.error(err);

            const msg =
                err.response?.data?.error || 'Erro ao criar conta.';

            Alert.alert('Erro', msg);
        } finally {
            setCarregando(false);
        }
    }

    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: '#eff2ff' }}
            contentContainerStyle={{ padding: 16 }}
        >
            <View
                style={{
                    backgroundColor: '#fff',
                    borderRadius: 16,
                    padding: 20,
                    marginTop: 24,
                    elevation: 2,
                    shadowColor: '#000',
                    shadowOpacity: 0.06,
                    shadowRadius: 8,
                    shadowOffset: { width: 0, height: 4 },
                }}
            >
                <Text
                    style={{
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: '#111827',
                        marginBottom: 16,
                    }}
                >
                    Criar conta
                </Text>

                {/* Nome */}
                <Text
                    style={{
                        fontSize: 13,
                        fontWeight: '500',
                        color: '#4b5563',
                        marginBottom: 4,
                    }}
                >
                    Nome completo
                </Text>
                <TextInput
                    value={nome}
                    onChangeText={setNome}
                    placeholder="Seu nome"
                    placeholderTextColor="#9ca3af"
                    style={{
                        borderWidth: 1,
                        borderColor: '#e5e7eb',
                        borderRadius: 10,
                        paddingHorizontal: 10,
                        paddingVertical: 10,
                        marginBottom: 12,
                        backgroundColor: '#f9fafb',
                        fontSize: 14,
                        color: '#111827',
                    }}
                />

                {/* E-mail */}
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
                <TextInput
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholder="seuemail@exemplo.com"
                    placeholderTextColor="#9ca3af"
                    style={{
                        borderWidth: 1,
                        borderColor: '#e5e7eb',
                        borderRadius: 10,
                        paddingHorizontal: 10,
                        paddingVertical: 10,
                        marginBottom: 12,
                        backgroundColor: '#f9fafb',
                        fontSize: 14,
                        color: '#111827',
                    }}
                />

                {/* Senha */}
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
                <TextInput
                    value={senha}
                    onChangeText={setSenha}
                    secureTextEntry
                    placeholder="Crie uma senha"
                    placeholderTextColor="#9ca3af"
                    style={{
                        borderWidth: 1,
                        borderColor: '#e5e7eb',
                        borderRadius: 10,
                        paddingHorizontal: 10,
                        paddingVertical: 10,
                        marginBottom: 20,
                        backgroundColor: '#f9fafb',
                        fontSize: 14,
                        color: '#111827',
                    }}
                />

                <TouchableOpacity
                    onPress={handleCadastro}
                    disabled={carregando}
                    style={{
                        backgroundColor: carregando ? '#93c5fd' : '#2563eb',
                        paddingVertical: 12,
                        borderRadius: 999,
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row',
                    }}
                >
                    <Ionicons name="person-add-outline" size={18} color="#fff" />
                    <Text
                        style={{
                            color: '#fff',
                            fontWeight: '600',
                            marginLeft: 8,
                            fontSize: 15,
                        }}
                    >
                        {carregando ? 'Criando...' : 'Criar conta'}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
