// src/components/ContestTable.tsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/disciplinaStore';
import { fetchDisciplinas, associateDisciplina } from '../../../store/disciplinaSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Table, Spinner, Alert } from 'react-bootstrap';
import styles from './ListAssociateDisciplina.module.scss';

const ListAssociateDisciplina: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { disciplinas, loading, error, successMessage } = useSelector((state: RootState) => state.disciplina);

  // Carregar disciplinas ao montar o componente
  useEffect(() => {
    if (id) {
      dispatch(fetchDisciplinas(id));
    }
  }, [dispatch, id]);

  // Handler para associar disciplina
  const handleAssociate = (disciplinaId: number) => {
    if (id) {
      dispatch(associateDisciplina({ idConcurso: id, idDisciplina: disciplinaId }));
    }
  };

  const updatePage = (disciplinaId: number) => {
      navigate(`/disciplina/${id}/${disciplinaId}`);
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Gerenciamento de Disciplinas</h3>

      {successMessage && (
        <Alert variant="success" className={styles.successAlert}>
          {successMessage}
        </Alert>
      )}


      {loading ? (
        <Spinner animation="border" className={styles.spinner} />
      ) : error ? (
        <p className={styles.textDanger}>{error}</p>
      ) : (
        <Table striped bordered hover  className={styles.table}>
          <thead>
            <tr>
              <th>Disciplina</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {disciplinas.map((disciplina) => (
              <tr key={disciplina.id}>
                <td>{disciplina.nome}</td>
                <td>
                  <Button
                    className={styles.buttonSuccess}
                    onClick={() => handleAssociate(disciplina.id)}
                  >
                    Associar ao Concurso
                  </Button>
                  &nbsp;
                  <Button
                    className={styles.buttonSuccess}
                    onClick={() => updatePage(disciplina.id)}
                  >
                    Atualizar Disciplina
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default ListAssociateDisciplina;
