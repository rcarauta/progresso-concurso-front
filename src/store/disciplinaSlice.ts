import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Disciplina } from '../models/Disciplina';


interface DisciplinaState {
  loading: boolean;
  successMessage: string | null;
  disciplinas: Disciplina[];
  error: string | null;
}

const initialState: DisciplinaState = {
  loading: false,
  successMessage: null,
  disciplinas: [],
  error: null,
};

export const saveDisciplina = createAsyncThunk(
  'disciplina/saveDisciplina',
  async (disciplina: Disciplina, { getState, rejectWithValue }) => {
    try {

      const state: any = getState();
      const token = state.auth.token;

      const response = await axios.post('http://localhost:8080/disciplina', disciplina,{
        headers: {
            'Authorization': `Bearer ${token}`,
        }});
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Erro ao salvar disciplina');
    }
  }
);


export const fetchDisciplinas = createAsyncThunk(
  'disciplinas/fetchDisciplinas',
  async (_, { getState, rejectWithValue }) => {
    try {
      // Obter o token do estado global
      const state: any = getState();
      const token = state.auth?.token;

      // Fazer a requisição para buscar disciplinas
      const response = await axios.get(
        `http://localhost:8080/disciplina/list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Erro ao buscar disciplinas');
    }
  }
);

export const associateDisciplina = createAsyncThunk(
  'disciplinas/associateDisciplina',
  async ({ idConcurso, idDisciplina }: { idConcurso: string; idDisciplina: number },
    {getState, rejectWithValue }
  ) => {
    try {
      const state: any = getState();
      const token = state.auth?.token;

      const response = await axios.post(
        `http://localhost:8080/concurso_disciplina/${idConcurso}/associar`,
        [idDisciplina],
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Erro ao associar disciplina');
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
      })
      //listar disciplina
      .addCase(fetchDisciplinas.fulfilled, (state, action) => {
        state.loading = false;
        state.disciplinas = action.payload;
      })
      .addCase(fetchDisciplinas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar disciplinas.';
      })
      //associar disciplina ao concurso
      .addCase(associateDisciplina.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Concurso associado com disciplina ocm sucesso!";
      });
  },
});

export const { clearMessages } = disciplinaSlice.actions;
export default disciplinaSlice.reducer;
