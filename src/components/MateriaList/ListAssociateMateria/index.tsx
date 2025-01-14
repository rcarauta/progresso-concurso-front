import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listMateriasSemAssociar, associarMateria } from '../../../store/materiaSlice';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button, Table, Spinner } from 'react-bootstrap';
import styles from './ListAssociate.module.scss';
import { AppDispatch, MateriaState } from '../../../store/materiaStore';
import { Materia } from '../../../models/Materia';

const AssociarMaterias: React.FC = () => {
  const { concursoId, disciplinaId } = useParams<{ concursoId: string, disciplinaId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Estado da lista de matérias
  const { materias, loading, error, sucessMessage } = useSelector((state: MateriaState) => state.materia);

  useEffect(() => {
    if (concursoId && disciplinaId) {
      dispatch(listMateriasSemAssociar({ concursoId: +concursoId, disciplinaId: +disciplinaId }));
    }
  }, [concursoId, disciplinaId, dispatch]);

  // Alteração aqui: ao invés de enviar o ID, passamos o objeto completo 'materia'
  const handleAssociarMateria = (materia: Materia) => {
    const idConcurso = concursoId == undefined ? 0 : concursoId;
    const idDisciplina = disciplinaId == undefined ? 0 : disciplinaId;
    dispatch(associarMateria({concursoId: +idConcurso, disciplinaId: +idDisciplina, materia}));
  };

  const updateMateria = (materiaId: number | null) => {
    navigate(`/materia/${concursoId}/${disciplinaId}/${materiaId}`);
  }

  return (
    <div className={styles.container}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Associação de Matérias</h1>
        <Link to={`/contest/table/${concursoId}/${disciplinaId}/materias`}>
          <Button variant="secondary">Voltar para Lista de Matérias</Button>
        </Link>
      </div>

      {loading && <Spinner animation="border" variant="primary" />}
      {error && <p className="text-danger">{error}</p>}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Porcentagem</th>
            <th>Tempo de Estudo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {materias && materias.length > 0 ? (
            materias.map((materia:Materia) => (
              <tr key={materia.id}>
                <td>{materia.nome}</td>
                <td>{materia.porcentagem}%</td>
                <td>{materia.tempoEstudo}</td>
                <td>
                  <Button 
                    variant="primary" 
                    onClick={() => handleAssociarMateria(materia)} // Passando o objeto completo 'materia'
                  >
                  </Button>
                  &nbsp;
                  <Button 
                    variant="primary" 
                    onClick={() => updateMateria(materia.id)} 
                  >
                    Atualizar Materia
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center">Nenhuma matéria disponível para associar</td>
            </tr>
          )}
        </tbody>
      </Table>
    
      {sucessMessage && (
          <p className={`mt-3 text-center ${styles.successMessage}`}>
            {sucessMessage}
          </p>
        )}

    </div>
  );
};

export default AssociarMaterias;
