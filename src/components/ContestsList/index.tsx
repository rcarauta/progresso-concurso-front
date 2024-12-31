import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios'; // Usando axios para fazer requisições HTTP
import styles from './ContestList.module.scss';
import { Contest } from '../../models/Contest';
import { hasAdminRole } from '../../utils/decodeToken';

const ContestList: React.FC = () => {
  const { token, username, isLoggedIn } = useSelector((state: RootState) => state.auth);
  const [contests, setContests] = useState<Contest[]>([]); // Estado para armazenar os concursos
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
          const response = await axios.get(`http://localhost:8080/concurso/list_porcentagem/${userId}`, {
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

  const handleSeeTable = (id: number) => {
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
