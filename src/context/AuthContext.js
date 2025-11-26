import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      const token = await AsyncStorage.getItem('@bustrack_token');
      const userJson = await AsyncStorage.getItem('@bustrack_user');

      if (token && userJson) {
        api.defaults.headers.Authorization = `Bearer ${token}`;
        setUsuario(JSON.parse(userJson));
      }
      setCarregando(false);
    }

    carregarDados();
  }, []);

  async function login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    const { token, user } = response.data;

    await AsyncStorage.setItem('@bustrack_token', token);
    await AsyncStorage.setItem('@bustrack_user', JSON.stringify(user));

    api.defaults.headers.Authorization = `Bearer ${token}`;
    setUsuario(user);
  }

  async function logout() {
    await AsyncStorage.removeItem('@bustrack_token');
    await AsyncStorage.removeItem('@bustrack_user');
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, carregando, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
