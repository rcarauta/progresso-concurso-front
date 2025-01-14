import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { AppDispatch } from './authStore';

interface AuthState {
  isLoggedIn: boolean;
  username: string | null;
  token: string | null;
  error: string | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  username: null,
  token : null,
  error: null,
};

// Slice de autenticação
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.error = null; // Limpa erros anteriores
    },
    loginSuccess: (state, action: PayloadAction<{username: string; token: string}>) => {
      state.isLoggedIn = true;
      state.username = action.payload.token;
      state.token = action.payload.token;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoggedIn = false;
      state.username = null;
      state.token = null;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.username = null;
      state.token = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, clearError } = authSlice.actions;
export default authSlice.reducer;

// Função para login assíncrono
export const loginAsync = (formData: { username: string; password: string }) => async (dispatch: AppDispatch) => {
  dispatch(loginStart());
  try {
    const response = await axios.post('http://localhost:8080/login', formData);
    
    if (response.status === 200) {
      const { token } = response.data;
      dispatch(loginSuccess({ username: formData.username, token }));

    } else {
      dispatch(loginFailure('Credenciais inválidas. Tente novamente.'));
    }
  } catch (error) {
    dispatch(loginFailure('Erro ao conectar com o servidor. Tente novamente.'+ error));
  }
};
