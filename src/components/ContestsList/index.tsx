import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import styles from './ContestList.module.scss';
import { contests } from '../../mocks/contests';
import { useNavigate } from 'react-router-dom';

const ContestList: React.FC = () => {
  const { username, isLoggedIn } = useSelector((state: RootState) => state.auth);
  const isAdmin = username === 'admin'; // Verifica se o usuário é administrador

  // Filtra os concursos com base no tipo de usuário
  const filteredContests = isAdmin
    ? contests
    : contests.filter((contest) => contest.adicionadoPor === username);

    const navigate = useNavigate();

    const handleSeeTable = () => {
      navigate('/contests/table'); // Redireciona para a página com a tabela de concursos
    };

  return (
    <div className={`container ${styles.contestListContainer}`}>
      <h2 className="text-center mt-4">Lista de Concursos</h2>

      {!filteredContests.length ? (
        <div className="alert alert-warning text-center mt-5">
          Sem concursos na lista
        </div>
      ) : (
        <div className="row mt-4">
          {filteredContests.map((contest) => (
            <div className="col-md-4" key={contest.id}>
              <div className="card p-3 mb-4 shadow-sm">
                <h5>{contest.nome}</h5>
                <p>
                  <strong>Data da Prova:</strong> {contest.dataProva}
                </p>
                <div className="progress mb-3">
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: `${contest.percentualEstudado}%` }}
                    aria-valuenow={contest.percentualEstudado}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    {contest.percentualEstudado}%
                  </div>
                </div>
                <button className="btn btn-primary w-100" onClick={handleSeeTable}>Ver Tabela</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContestList;
