import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/authStore';
import { loginAsync, logout, clearError } from '../../store/authSlice';
import styles from './LoginForm.module.scss';

const LoginForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoggedIn, username, error } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginAsync(formData)); // Dispara a ação de login assíncrono
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  return (
    <div className={`container ${styles.loginContainer}`}>
      {isLoggedIn ? (
        <div className="text-center mt-5">
          <div className="alert alert-success">
            Bem-vindo, <strong>{username}</strong>!
          </div>
          <button className="btn btn-danger mt-3" onClick={handleLogout}>
            Sair
          </button>
        </div>
      ) : (
        <form className={`card p-4 shadow ${styles.loginForm}`} onSubmit={handleSubmit}>
          <h2 className="text-center mb-4">Login</h2>

          {error && (
            <div className="alert alert-danger" onClick={handleClearError}>
              {error}
            </div>
          )}

          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Usuário
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Digite seu usuário"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Senha
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Digite sua senha"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Entrar
          </button>
        </form>
      )}
    </div>
  );
};

export default LoginForm;
