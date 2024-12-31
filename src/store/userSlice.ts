import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { User } from '../models/User';
import { loginSuccess } from './authSlice';

interface UserState {
    users: User[];
    loading: boolean;
    error: string | null;
    successMessage: string | null;
}

const initialState: UserState = {
    users: [],
    loading: false,
    error: null,
    successMessage: null
};

export const createUser = createAsyncThunk(
    'user/createUser',
    async (user: User, { getState, rejectWithValue }) => {
        try {

            const state: any = getState();
            const token = state.auth.token;

            const response = await axios.post('http://localhost:8080/user', user,{
                headers: {
                    'Authorization': `Bearer ${token}`,
                }});
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Erro ao criar usuário');
        }
    } 
);

export const fetchUsers = createAsyncThunk(
    'user/fetchUsers',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state: any = getState();
            const token = state.auth.token;

            const response = await axios.get('http://localhost:8080/user/list', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Erro ao listar usuários');
        }
    }
);


export const loginAsUser = createAsyncThunk(
    'user/loginAsUser',
    async (username: string, { getState, dispatch, rejectWithValue }) => {
        try {

            const state: any = getState();
            const token = state.auth.token;

            const response = await axios.post(`http://localhost:8080/login/generate-token/${username}`,'',{
                headers: {
                    'Authorization': `Bearer ${token}`,
                }});

                const newToken = response.data.token;

                dispatch(loginSuccess({ username, token: newToken }));

            return response.data;
        } catch (error: any) {
            console.log(error);
            return rejectWithValue(error.response?.data || 'Erro ao criar usuário');
        }
    } 
);

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        clearSuccessMessage: (state) => {
            state.successMessage = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users.push(action.payload);
                state.successMessage = "Usuário criado com sucesso!";
            })
            .addCase(createUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.successMessage = null;
            })
            //listar usuario
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            //login as user
            .addCase(loginAsUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(loginAsUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users.push(action.payload);
                state.successMessage = "Usuário criado com sucesso!";
            })
            .addCase(loginAsUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.successMessage = null;
            })
    },
});

export const { clearSuccessMessage } = userSlice.actions;
export default userSlice.reducer;
