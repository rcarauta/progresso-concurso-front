import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios'; // Usando axios para fazer requisições HTTP
import styles from './ContestList.module.scss';

const ContestList: React.FC = () => {
  const { token, username, isLoggedIn } = useSelector((state: RootState) => state.auth);
  const [contests, setContests] = useState<any[]>([]); // Estado para armazenar os concursos
  const [loading, setLoading] = useState<boolean>(false); // Estado de carregamento
  const [error, setError] = useState<string | null>(null); // Estado de erro

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn && token) {
      // Decodificando o JWT para extrair o userId
      const decoded: any = jwtDecode(token);
      const userId = decoded.userId; // Extraindo o userId do token decodificado

      // Função para buscar os concursos
      const fetchContests = async () => {
        setLoading(true); // Inicia o carregamento
        try {
          const response = await axios.get(`http://localhost:8080/concurso/list/${userId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            },
          });
          setContests(response.data); // Atualiza o estado com os concursos
        } catch (err) {
          setError('Erro ao buscar concursos.' +  err);
        } finally {
          setLoading(false); // Finaliza o carregamento
        }
      };

      fetchContests(); // Chama a função para buscar os concursos
    }
  }, [isLoggedIn, token]); // Reexecuta o useEffect quando o status de login ou o token mudar

  const handleSeeTable = () => {
    navigate('/contests/table'); // Redireciona para a página com a tabela de concursos
  };

  return (
    <div className={`container ${styles.contestListContainer}`}>
      <h2 className="text-center mt-4">Lista de Concursos</h2>

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

      {!loading && !error && !contests.length && (
        <div className="alert alert-warning text-center mt-5">
          Sem concursos na lista
        </div>
      )}

      <div className="row mt-4">
        {contests.map((contest) => (
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
              <button className="btn btn-primary w-100" onClick={handleSeeTable}>
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