import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { DisciplinaMateria } from '../models/DisciplinaMateria';
import { RootState } from './authStore';
import { http } from '../http';

// Estado inicial
interface DisciplinaState {
  loading: boolean;
  error: string | null;
  disciplinasMateria: DisciplinaMateria[];
}

const initialState: DisciplinaState = {
  loading: false,
  error: null,
  disciplinasMateria: [],
};


export const fetchDisciplinaMateria = createAsyncThunk<DisciplinaMateria[], { concursoId: string }>(
  'disciplinas/fetchDisciplinaMateria',
  async ({ concursoId }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = (state as RootState).auth.token; 

      const response = await http.get(`/disciplina_materia/${concursoId}/questoes_total`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(error || 'Erro desconhecido');
    }
  }
);

const disciplinaMateriaSlice = createSlice({
  name: 'disciplinas',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDisciplinaMateria.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDisciplinaMateria.fulfilled, (state, action) => {
        state.loading = false;
        state.disciplinasMateria = action.payload;
      })
      .addCase(fetchDisciplinaMateria.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar dados';
      });
  },
});

export default disciplinaMateriaSlice.reducer;
