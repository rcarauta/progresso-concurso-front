import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Contest } from '../models/Contest';
import { RootState } from './authStore';
import { http } from '../http';

// Estado inicial
interface ConcursoState {
  loading: boolean;
  error: string | null;
  concurso: Contest | null;
  concursos: Contest[]
}

const initialState: ConcursoState = {
  loading: false,
  error: null,
  concurso: null,
  concursos: []
};


export const saveConcurso = createAsyncThunk(
    'concurso/saveConcurso',
    async (concurso: Contest, { getState, rejectWithValue }) => {
      try {
  
        const state = getState();
        const token = (state as RootState).auth.token;
  
        const response = await http.post('/concurso', concurso,{
          headers: {
              'Authorization': `Bearer ${token}`,
          }});
        return response.data;
      } catch (error: unknown) {
        return rejectWithValue(error || 'Erro ao salvar o concurso');
      }
    }
  );

  export const cloneConcurso = createAsyncThunk(
    'concurso/cloneConcurso',
    async ({concursoId, userId} : {concursoId: number, userId: number}, { getState, rejectWithValue }) => {
      try {
  
        const state = getState();
        const token = (state as RootState).auth.token;
  
        const response = await http.post(`/concurso/clonar_concurso/${concursoId}`,[userId],{
          headers: {
              'Authorization': `Bearer ${token}`,
          }});
        return response.data;
      } catch (error: unknown) {
        return rejectWithValue(error || 'Erro ao clonar o concurso');
      }
    }
  );

  // Thunk para buscar todos os concursos
export const listConcursos = createAsyncThunk(
    'concurso/listConcursos',
    async (_, {getState, rejectWithValue }) => {
      try {

        const state = getState();
        const token = (state as RootState).auth.token;

        const response = await http.get('/concurso/list', {
            headers: {
                'Authorization': `Bearer ${token}`,
            }});


        return response.data;
      } catch (error: unknown) {
        return rejectWithValue(error || 'Erro ao buscar concursos');
      }
    }
  );

  export const fetchContests = createAsyncThunk(
    'contests/fetchContests',
    async (userId: number, { getState, rejectWithValue }) => {
      try {
        const state = getState() as RootState;
        const token = state.auth.token;
  
        const response = await http.get(`/concurso/list_porcentagem/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
  
        return response.data;
      } catch (error: unknown) {
        return rejectWithValue(error || 'Erro ao buscar concursos');
      }
    }
  );
  

const concursoSlice = createSlice({
  name: 'cocnruso',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(saveConcurso.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveConcurso.fulfilled, (state, action) => {
        state.loading = false;
        state.concurso = action.payload;
      })
      .addCase(saveConcurso.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar dados';
      })
      //clonar concurso
      .addCase(cloneConcurso.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cloneConcurso.fulfilled, (state, action) => {
        state.loading = false;
        state.concurso = action.payload;
      })
      .addCase(cloneConcurso.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao clonar o concurso';
      })
      //listar concursos
      .addCase(listConcursos.fulfilled, (state, action) => {
          state.loading = false;
          state.concursos = action.payload;
      })
      .addCase(listConcursos.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message || 'Erro ao carregar concursos.';
      })
      //fetch concursos
      .addCase(fetchContests.fulfilled, (state, action) => {
          state.loading = false;
          state.concursos = action.payload;
      })
      .addCase(fetchContests.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message || 'Erro ao carregar concursos.';
      })
   },
});

export default concursoSlice.reducer;