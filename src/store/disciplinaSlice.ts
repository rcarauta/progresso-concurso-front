import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Disciplina } from '../models/Disciplina';
import { Contest } from '../models/Contest';
import { RootState } from './authStore';
import { http } from '../http';


interface DisciplinaState {
  loading: boolean;
  successMessage: string | null;
  disciplinas: Disciplina[];
  error: string | null;
  concurso: Contest;
  disciplina: Disciplina | null;
}

const initialState: DisciplinaState = {
  loading: false,
  successMessage: null,
  disciplinas: [],
  error: null,
  concurso: {
    listaDisciplinaEntity: [],
    listaDisciplinaRequest: []
  } as unknown as Contest,
  disciplina: null,
};

export const saveDisciplina = createAsyncThunk(
  'disciplina/saveDisciplina',
  async (disciplina: Disciplina, { getState, rejectWithValue }) => {
    try {

      const state = getState();
      const token = (state as RootState).auth.token;

      const response = await http.post('/disciplina', disciplina,{
        headers: {
            'Authorization': `Bearer ${token}`,
        }});
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(error || 'Erro ao salvar disciplina');
    }
  }
);


export const fetchDisciplinas = createAsyncThunk(
  'disciplinas/fetchDisciplinas',
  async (concursoId: string, { getState, rejectWithValue }) => {
    try {
      // Obter o token do estado global
      const state = getState();
      const token = (state as RootState).auth?.token;

      // Fazer a requisição para buscar disciplinas
      const response = await http.get(
        `/disciplina/${concursoId}/list_not_concurso`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(error || 'Erro ao buscar disciplinas');
    }
  }
);

export const associateDisciplina = createAsyncThunk(
  'disciplinas/associateDisciplina',
  async ({ idConcurso, idDisciplina }: { idConcurso: string; idDisciplina: number | undefined },
    {getState, rejectWithValue }
  ) => {
    try {
      const state = getState();
      const token = (state as RootState).auth?.token;

      const response = await http.post(
        `/concurso_disciplina/${idConcurso}/associar`,
        [idDisciplina],
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(error || 'Erro ao associar disciplina');
    }
  }
);

export const fetchDisciplinasConcurso = createAsyncThunk(
  'disciplinas/fetchDisciplinasConcurso',
  async (concursoId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = (state as RootState).auth?.token;

      const response = await http.get(
        `/concurso_disciplina/${concursoId}/todas_disciplinas`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data; // Certifique-se de que o retorno seja uma lista de disciplinas
    } catch (error: unknown) {
      return rejectWithValue(error || 'Erro ao buscar disciplinas');
    }
  }
);

export const ordenateDisciplina = createAsyncThunk(
  'disciplinas/ordenateDisciplina',
  async ({ idConcurso, disciplinaId, numeroOrdem }: { idConcurso: number; disciplinaId: number, numeroOrdem: number },
    {getState, rejectWithValue }
  ) => {
    try {
      const state = getState();
      const token = (state as RootState).auth?.token;

      const response = await http.put(
        `/concurso_disciplina/${idConcurso}/${disciplinaId}/ordenar`,
         [numeroOrdem],
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(error || 'Erro ao associar ordem a uma disciplina');
    }
  }
);


export const fetchDisciplinasOrdemConcurso = createAsyncThunk(
  'disciplinas/fetchDisciplinasOrdemConcurso',
  async (concursoId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = (state as RootState).auth?.token;

      const response = await http.get(
        `/concurso_disciplina/${concursoId}/listar_ordem`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data; // Certifique-se de que o retorno seja uma lista de disciplinas
    } catch (error: unknown) {
      return rejectWithValue(error || 'Erro ao buscar disciplinas');
    }
  }
);

export const findDisciplina = createAsyncThunk(
  'disciplinas/findDisciplina',
  async (disciplinaId: number, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = (state as RootState).auth?.token;

      const response = await http.get(
        `/disciplina/${disciplinaId}/selecinar_disciplina`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data; 
    } catch (error: unknown) {
      return rejectWithValue(error || 'Erro ao buscar disciplina');
    }
  }
);

export const updateCiclosDisciplinaConcurso = createAsyncThunk(
  'disciplinas/updateCiclosDisciplinaConcurso',
  async ({ idConcurso, disciplinaId, ciclos }: { idConcurso: number; disciplinaId: number, ciclos: number },
    {getState, rejectWithValue }
  ) => {
    try {
      const state = getState();
      const token = (state as RootState).auth?.token;

      const response = await http.put(
        `/concurso_disciplina/${idConcurso}/${disciplinaId}/atualizar_ciclo`,
         [ciclos],
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(error || 'Erro ao associar ordem a uma disciplina');
    }
  }
);

export const deletarDisciplinasConcurso = createAsyncThunk(
  'disciplinas/deletarDisciplinasConcurso',
  async ({concursoId, disciplinaId}: { concursoId: number, disciplinaId: number}, 
    { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = (state as RootState).auth?.token;

      const response = await http.delete(
        `/concurso_disciplina/${concursoId}/${disciplinaId}/remover_disciplina`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data; // Certifique-se de que o retorno seja uma lista de disciplinas
    } catch (error: unknown) {
      return rejectWithValue(error || 'Erro ao buscar disciplinas');
    }
  }
);


export const updateDisciplina = createAsyncThunk(
  'disciplinas/updateDisciplina',
  async (disciplina: Disciplina, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = (state as RootState).auth?.token;

      const response = await http.put(
        `/disciplina/${disciplina.id}/alterar_disciplina`,disciplina,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data; 
    } catch (error: unknown) {
      return rejectWithValue(error || 'Erro ao buscar disciplina');
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
      .addCase(associateDisciplina.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = "Concurso associado com disciplina ocm sucesso!";
      })
      //lista disciplina concurso
      .addCase(fetchDisciplinasConcurso.fulfilled, (state, action) => {
        state.loading = false;
        state.concurso = action.payload;
      })
      .addCase(fetchDisciplinasConcurso.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar disciplinas.';
      })
      //associar oredem disciplina
      .addCase(ordenateDisciplina.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = "Ordem da disciplina salva com sucesso!";
      })
      //lista disciplina ordem concurso
      .addCase(fetchDisciplinasOrdemConcurso.fulfilled, (state, action) => {
        state.loading = false;
        state.concurso = action.payload;
      })
      .addCase(fetchDisciplinasOrdemConcurso.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar disciplinas na ordem.';
      })
      //removerDisciplinaConcurso
      .addCase(deletarDisciplinasConcurso.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deletarDisciplinasConcurso.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar disciplinas na ordem.';
      })
      //find disciplina
      .addCase(findDisciplina.fulfilled, (state, action) => {
        state.loading = false;
        state.disciplina = action.payload;
      })
      .addCase(findDisciplina.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar disciplinas.';
      })
      //update disciplina
      .addCase(updateDisciplina.fulfilled, (state, action) => {
        state.loading = false;
        state.disciplina = action.payload;
      })
      .addCase(updateDisciplina.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao salvar disciplina.';
      })
  },
});

export const { clearMessages } = disciplinaSlice.actions;
export default disciplinaSlice.reducer;
