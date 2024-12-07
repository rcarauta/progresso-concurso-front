import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice'; // Seu reducer de autenticação
import userReducer from './userSlice'; // Seu reducer de usuários
import disciplinaReducer from './disciplinaSlice';

const rootReducer = combineReducers({
    auth: authReducer, // authStore agora é parte do mesmo store
    users: userReducer, // userStore também faz parte
    disciplina: disciplinaReducer
});

export default rootReducer;