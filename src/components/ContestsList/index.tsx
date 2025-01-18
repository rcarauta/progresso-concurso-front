import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch  } from 'react-redux';
import { RootState } from '../../store/authStore';
import { ConcursoStore } from '../../store/concursoStore'; 
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import styles from './ContestList.module.scss';
import { Contest } from '../../models/Contest';
import { hasAdminRole } from '../../utils/decodeToken';
import { CustomJwtPayload } from '../../utils/CustomJwtPayload';
import { AppDispatch } from '../../store/userStore';
import { fetchContests } from '../../store/concursoSlice';

const ContestList: React.FC = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  const { concursos } = useSelector((state: ConcursoStore) => state.concurso);
  const [loading] = useState<boolean>(false); // Estado de carregamento
  const [error] = useState<string | null>(null); // Estado de erro

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
    

  useEffect(() => {
    const tokenString = token == undefined ? '' : token;
    const decoded: CustomJwtPayload = jwtDecode(tokenString);
    const userId = decoded.userId; // Extraindo o userId do token decodificado
    if (token && userId) {
      dispatch(fetchContests(userId));
    }
  }, [dispatch, token]);

  const handleSeeTable = (id: number | undefined) => {
    navigate(`/contests/table/${id}`); // Redireciona para a página com a tabela de concursos
  };

  const handleAddContest = () => {
    navigate('/contests/novo'); // Redireciona para a página de criação de concursos
  };

  const handleConcursoClone = () => {
    navigate('/contests/clonar');
  }

  const handleLoginAsUser = () => {
    navigate('/user/enter');
  }

  return (
    <div className={`container ${styles.contestListContainer}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mt-4">Lista de Concursos</h2>
       {hasAdminRole(token) && 
        ( <button className="btn btn-success" onClick={handleAddContest}>
            Adicionar Novo Concurso
          </button> )} 

        {hasAdminRole(token) && 
        ( <button className="btn btn-success" onClick={handleConcursoClone}>
            Clonar Concurso
          </button> )}
       
        {hasAdminRole(token) && 
        ( <button className="btn btn-success" onClick={handleLoginAsUser}>
            Entrar Como Usuário
          </button> )}
      </div>

      {loading && (
        <div className="alert alert-info text-center mt-5">
          Carregando concursos...
        </div>
      )}

      {error && (
        <div className="alert alert-danger text-center mt-5">
          {error}
        </div>
      )}

      {!loading && !error && !concursos.length && (
        <div className="alert alert-warning text-center mt-5">
          Sem concursos na lista
        </div>
      )}

      <div className="row mt-4">
        {concursos.map((contest: Contest) => (
          <div className="col-md-4" key={contest.id}>
            <div className="card p-3 mb-4 shadow-sm">
              <h5>{contest.nome}</h5>
              <p>
                <strong>Data da Prova:</strong> {contest.dataProvaDate}
              </p>
              <div className="progress mb-3">
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: `${contest.percentualEstudadoFloat}%` }}
                  aria-valuenow={contest.percentualEstudadoFloat}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  {contest.percentualEstudadoFloat}%
                </div>
              </div>
              <button className="btn btn-primary w-100" onClick={() => handleSeeTable(contest.id)}>
                Ver Tabela
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContestList;
