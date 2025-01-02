import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Materia } from '../models/Materia';


// Define o estado inicial
interface MateriaState {
  materias: Materia[];
  materia: Materia | null;
  loading: boolean;
  error: string | null;
  sucessMessage: string | null;
}

const initialState: MateriaState = {
  materias: [],
  materia: null,
  loading: false,
  error: null,
  sucessMessage: null
};

// Define o Thunk para salvar a matéria
export const saveMateria = createAsyncThunk<Materia, Materia, { rejectValue: string }>(
  'materia/saveMateria',
  async (materia, {getState, rejectWithValue }) => {
    try {
        const state: any = getState();
        const token = state.auth.token;

      const response = await axios.post('http://localhost:8080/materia', materia, {
        headers: {
            'Authorization': `Bearer ${token}`,
        }});

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Erro desconhecido');
    }
  }
);

// Thunk para listar as matérias associadas
export const listMaterias = createAsyncThunk<Materia[], { concursoId: number, disciplinaId: number }, { rejectValue: string }>(
    'materia/listMaterias',
    async ({ concursoId, disciplinaId }, { getState, rejectWithValue }) => {
      try {
        const state: any = getState();
        const token = state.auth.token;  // Supondo que o token está no estado de auth
  
        const response = await axios.get(`http://localhost:8080/concurso_disciplina_materia/${concursoId}/${disciplinaId}/recuperar`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
  
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response?.data || 'Erro desconhecido');
      }
    }
  );

  // Thunk para listar as matérias associadas
export const listMateriasSemAssociar = createAsyncThunk<Materia[], { concursoId: number, disciplinaId: number }, { rejectValue: string }>(
    'materia/listMateriasSemAssociar',
    async ({ concursoId, disciplinaId }, { getState, rejectWithValue }) => {
      try {
        const state: any = getState();
        const token = state.auth.token;  // Supondo que o token está no estado de auth
  
        const response = await axios.get(`http://localhost:8080/materia/${concursoId}/${disciplinaId}/list`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
  
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response?.data || 'Erro desconhecido');
      }
    }
  );

 
  export const associarMateria = createAsyncThunk<void, { concursoId: number, disciplinaId: number, materia: Materia }, { rejectValue: string }>(
    'materia/associarMateria',
    async ({ concursoId, disciplinaId, materia }, { getState, rejectWithValue }) => {
      try {
        // Pegando o token do estado de autenticação
        const state: any = getState();
        const token = state.auth.token;  // Supondo que o token está no estado de auth
  
        // Fazendo a requisição POST para associar a matéria
        await axios.post(
          `http://localhost:8080/concurso_disciplina_materia/${concursoId}/${disciplinaId}/associar`,
          materia, // Envia o objeto completo da matéria como corpo da requisição
          {
            headers: {
              'Authorization': `Bearer ${token}`,  // Envia o token no cabeçalho de autorização
            }
          }
        );
      } catch (error: any) {
        // Se ocorrer um erro, retorna a mensagem de erro
        return rejectWithValue(error.response?.data || 'Erro desconhecido');
      }
    }
  );


export const updateMateria = createAsyncThunk<Materia,{ concursoId: number, disciplinaId: number, materia: Materia }, { rejectValue: string }>(
  'materia/updateMateria',
  async ({concursoId, disciplinaId, materia}, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      const token = state.auth.token; 

      const response = await axios.put(
        `http://localhost:8080/concurso_disciplina_materia/${concursoId}/${disciplinaId}/alterar`,
        materia,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Erro desconhecido');
    }
  }
);

export const deleteMateriaDisciplnaConcurso = createAsyncThunk<Materia,{ concursoId: number, disciplinaId: number, materiaId: number }, { rejectValue: string }>(
  'materia/deleteMateriaDisciplnaConcurso',
  async ({concursoId, disciplinaId, materiaId}, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      const token = state.auth.token; 

      const response = await axios.delete(
        `http://localhost:8080/concurso_disciplina_materia/${concursoId}/${disciplinaId}/${materiaId}/desassociar`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Erro desconhecido');
    }
  }
);


export const atualizarMateria = createAsyncThunk(
  'materia/atualizarMateria',
  async (materia: Materia, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      const token = state.auth.token; 

      const response = await axios.put(
        `http://localhost:8080/materia/atualizar`,
        materia,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Erro desconhecido');
    }
  }
);

export const recuperaMateria = createAsyncThunk(
  'materia/recuperaMateria',
  async ( materiaId: number , { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      const token = state.auth.token;  // Supondo que o token está no estado de auth

      const response = await axios.get(`http://localhost:8080/materia/${materiaId}/recuperar_materia`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Erro desconhecido');
    }
  }
);

  

// Cria o Slice do Redux
const materiaSlice = createSlice({
  name: 'materia',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(saveMateria.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveMateria.fulfilled, (state, action: PayloadAction<Materia>) => {
        state.loading = false;
        state.materia = action.payload;
        state.sucessMessage = 'Matéria salva com sucesso!';
      })
      .addCase(saveMateria.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Erro ao salvar a matéria';
        state.sucessMessage = null;
      })
      //listar Materias
      .addCase(listMaterias.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listMaterias.fulfilled, (state, action: PayloadAction<Materia[]>) => {
        state.loading = false;
        state.materias = action.payload;
      })
      .addCase(listMaterias.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Erro ao listar as matérias';
      })
      //lista Materias Sem Associar
      .addCase(listMateriasSemAssociar.pending, (state) => {
        state.loading = true;
      })
      .addCase(listMateriasSemAssociar.fulfilled, (state, action) => {
        state.loading = false;
        state.materias = action.payload;
      })
      .addCase(listMateriasSemAssociar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Erro ao listar as matérias';
      })
      //associar materia
      .addCase(associarMateria.pending, (state) => {
        state.loading = true;
      })
      .addCase(associarMateria.fulfilled, (state, action) => {
        state.loading = false;
        state.sucessMessage = "matéria associada com sucesso!";
        // Lógica para atualizar a lista de matérias ou status, se necessário
      })
      .addCase(associarMateria.rejected, (state) => {
        state.loading = false;
        state.error = 'Erro ao associar matéria';
      })
      //Atualizar materia
      .addCase(updateMateria.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateMateria.fulfilled, (state, action) => {
        state.loading = false;
        state.materia = action.payload;
      })
      .addCase(updateMateria.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Erro ao listar as matérias';
      })
      //deletar Materia
      .addCase(deleteMateriaDisciplnaConcurso.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteMateriaDisciplnaConcurso.fulfilled, (state) => {
        state.loading = false;;
      })
      .addCase(deleteMateriaDisciplnaConcurso.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Erro ao listar as matérias';
      }) 
      //Atualizar materia
      .addCase(atualizarMateria.pending, (state) => {
        state.loading = true;
      })
      .addCase(atualizarMateria.fulfilled, (state, action) => {
        state.loading = false;
        state.materia = action.payload;
      })
      .addCase(atualizarMateria.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Erro ao listar as matérias';
      }) 
      //Recupera materia
      .addCase(recuperaMateria.pending, (state) => {
        state.loading = true;
      })
      .addCase(recuperaMateria.fulfilled, (state, action) => {
        state.loading = false;
        state.materia = action.payload;
      })
      .addCase(recuperaMateria.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Erro ao listar as matérias';
      }) 
  },
});

export default materiaSlice.reducer;
