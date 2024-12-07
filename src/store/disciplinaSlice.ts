import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Disciplina } from '../models/Disciplina';


interface DisciplinaState {
  loading: boolean;
  successMessage: string | null;
  error: string | null;
}

const initialState: DisciplinaState = {
  loading: false,
  successMessage: null,
  error: null,
};

export const saveDisciplina = createAsyncThunk(
  'disciplina/saveDisciplina',
  async (disciplina: Disciplina, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:8080/disciplina', disciplina);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Erro ao salvar disciplina');
    }
  }
);

const disciplinaSlice = createSlice({
  name: 'disciplina',
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.successMessage = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveDisciplina.pending, (state) => {
        state.loading = true;
        state.successMessage = null;
        state.error = null;
      })
      .addCase(saveDisciplina.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = 'Disciplina salva com sucesso!';
      })
      .addCase(saveDisciplina.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearMessages } = disciplinaSlice.actions;
export default disciplinaSlice.reducer;
