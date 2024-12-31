import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/authStore';
import { logout } from '../../store/authSlice';
import styles from './Header.module.scss';
import { hasAdminRole } from '../../utils/decodeToken';

const Header: React.FC = () => {
  const {token, isLoggedIn, username } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login'); // Redireciona para a página de login ao fazer logout
  };

  if (!isLoggedIn) {
    return null; // Não renderiza o Header se o usuário não estiver logado
  }

  return (
    <header className={`navbar navbar-expand-lg navbar-light bg-light ${styles.header}`}>
      <div className="container">
        <Link className="navbar-brand" to="/home">
          <strong>Progresso Concurso</strong>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/home">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contests">
                Concursos
              </Link>
            </li>
            <li className="nav-item">
             {hasAdminRole(token) && (<Link className="nav-link" to="/user">
                Usuários
              </Link>) }
            </li>
            <li className="nav-item">
             {hasAdminRole(token) && (<Link className="nav-link" to="/disciplina/novo">
                Disciplinas
              </Link>) }
            </li>
            <li className="nav-item">
             {hasAdminRole(token) && (<Link className="nav-link" to="/materia/novo">
                Materias
              </Link>) }
            </li>
            {username === 'admin' && (
              <li className="nav-item">
                {hasAdminRole(token) && (<Link className="nav-link" to="/admin">
                  Administração
                </Link>) }
              </li>
            )}
            <li className="nav-item">
              <button className="btn btn-outline-danger nav-link" onClick={handleLogout}>
                Sair
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
