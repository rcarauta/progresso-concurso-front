import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listMaterias, updateMateria, deleteMateriaDisciplnaConcurso } from '../../store/materiaSlice';
import { useParams, Link } from 'react-router-dom';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import styles from './MateriaList.module.scss';
import { RootState as AuthState } from '../../store/authStore';
import { hasAdminRole } from '../../utils/decodeToken';
import { Materia } from '../../models/Materia';

const MateriaList: React.FC = () => {
  const { concursoId, disciplinaId } = useParams<{ concursoId: string, disciplinaId: string }>();
  const dispatch = useDispatch();

  const { token } = useSelector((state: AuthState) => state.auth);
  const { materias, loading, error } = useSelector((state: any) => state.materia);

  const [editedMaterias, setEditedMaterias] = useState<{ [key: number]: any }>({});
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [showPercentageModal, setShowPercentageModal] = useState(false);
  const [currentMateria, setCurrentMateria] = useState<any>(null);
  const [percentage, setPercentage] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(60 * 40); 
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (concursoId && disciplinaId) {
      dispatch(listMaterias({ concursoId: +concursoId, disciplinaId: +disciplinaId }));
    }
  }, [concursoId, disciplinaId, dispatch]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (running && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (timeRemaining <= 0) {
      clearInterval(timer);
      handleFinalize();
    }
    return () => clearInterval(timer);
  }, [running, timeRemaining]);

  const handleInputChange = (id: number, field: string, value: number) => {
    setEditedMaterias((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleStart = (materia: any) => {
    setCurrentMateria(materia);
    setShowTimerModal(true);
    setTimeRemaining(60 * 40); 
    setRunning(true);
  };

  const handlePause = () => {
    setRunning(false);
  };

  const handleResume = () => {
    setRunning(true);
  };

  const handleFinalize = () => {
    setRunning(false);
    setShowTimerModal(false);
    setShowPercentageModal(true);
  };

  const handleSavePercentage = () => {
    if (currentMateria) {

      const studiedMinutes = 40 - Math.floor(timeRemaining / 60);

      const updatedMateria = {
        ...currentMateria,
        porcentagem: percentage,
        tempoEstudo: minutesToTime(studiedMinutes),
      };

      dispatch(updateMateria({concursoId: +concursoId!, disciplinaId: +disciplinaId!, materia: updatedMateria}))
        .unwrap()
        .then(() => {
          dispatch(listMaterias({ concursoId: +concursoId!, disciplinaId: +disciplinaId! }));
          setShowPercentageModal(false);
        })
        .catch((error: any) => {
          console.error('Erro ao atualizar matéria:', error);
        });
    }
  };

  const handleSave = (materia) => {
    if (materia) {
      const updatedMateria = {
        ...materia,
        porcentagem: materia.porcentagem,
        tempoEstudo: minutesToTime(0),
        totalQuestoes: editedMaterias[materia.id]?.totalQuestoes ?? materia.totalQuestoes,
        questoesAcertadas: editedMaterias[materia.id]?.questoesAcertadas ?? materia.questoesAcertadas,
      };

      dispatch(
        updateMateria({
          concursoId: +concursoId!,
          disciplinaId: +disciplinaId!,
          materia: updatedMateria,
        })
      )
        .unwrap()
        .then(() => {
          dispatch(listMaterias({ concursoId: +concursoId!, disciplinaId: +disciplinaId! }));
        })
        .catch((error: any) => {
          console.error('Erro ao atualizar matéria:', error);
        });
    }
  };

  const desasiciateMateria = (materiaId) => {
    dispatch(deleteMateriaDisciplnaConcurso({concursoId: +concursoId!, disciplinaId: +disciplinaId!, materiaId: materiaId}))
  }


  const minutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
  };

  const calculateProgress = (): number => {
    return (timeRemaining / (60 * 40)) * 100;
  };

  const calculatePercentage = (acertadas, total) => {
    if (total === 0) return 0;
    return (acertadas / total) * 100;
  };

  const getColorForPercentage = (percentage: number): string => {
    if (percentage < 70) return styles.bgRed;
    if (percentage >= 70 && percentage <= 75) return styles.bgYellow;
    return styles.bgGreen;
  };
  

  return (
    <div className={styles.container}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Matérias Associadas</h1>
       {hasAdminRole(token) && (<Link to={`/contest/table/${concursoId}/${disciplinaId}/materias/associar`}>
          <Button variant="primary">Associar Matéria</Button>
        </Link>)}
      </div>

      {loading && <p>Carregando...</p>}
      {error && <p className="text-danger">{error}</p>}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Tempo de Estudo (minutos)</th>
            <th>% Conclusão</th>
            <th>Total de Questões</th>
            <th>Questões Acertadas</th>
            <th>% de Acertos</th>
            <th>Cronômetro</th>
            <th>Ações</th>
            {hasAdminRole(token) && ( <th>Deletar</th> ) }
          </tr>
        </thead>
        <tbody>
          {materias && materias.length > 0 ? (
            materias.map((materia) => {
              const percentage = calculatePercentage(materia.questoesAcertadas, materia.totalQuestoes);
              const bgColor = percentage >= 75 ? 'bg-success' : percentage >= 70 ? 'bg-warning' : 'bg-danger';
              return (
                <tr key={materia.id}>
                  <td>{materia.nome}</td>
                  <td>{materia.tempoEstudo}</td>
                  <td>{materia.porcentagem}%</td>
                  <td>
                    <input
                        type="number"
                        min="0"
                        className={styles.inputField}
                        value={
                            editedMaterias[materia.id]?.totalQuestoes !== undefined
                            ? editedMaterias[materia.id]?.totalQuestoes
                            : materia.totalQuestoes || ''
                        }
                        onChange={(e) =>
                            handleInputChange(materia.id, 'totalQuestoes', Number(e.target.value))
                        }
                        />
                  </td>
                  <td>
                    <input
                        type="number"
                        min="0"
                        className={styles.inputField}
                        value={
                            editedMaterias[materia.id]?.questoesAcertadas !== undefined
                            ? editedMaterias[materia.id]?.questoesAcertadas
                            : materia.questoesAcertadas || ''
                        }
                        onChange={(e) =>
                            handleInputChange(materia.id, 'questoesAcertadas', Number(e.target.value))
                        }
                        />
                  </td>
                  <td className={`${styles.cell} ${getColorForPercentage(percentage)}`}>
                    {percentage.toFixed(2)}%
                 </td>
                  <td>
                    <Button variant="primary" onClick={() => handleStart(materia)}>
                      Iniciar
                    </Button>
                  </td>
                  <td>
                    <Button
                        variant="success"
                        onClick={() => handleSave(materia)}>
                        Salvar
                    </Button>
                  </td>
                  {hasAdminRole(token) && ( <td>
                    <Button
                        variant="danger"
                        onClick={() => desasiciateMateria(materia.id)}>
                        Desassociar
                    </Button>
                  </td> )}
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={6} className="text-center">
                Nenhuma matéria associada
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Modal do Cronômetro */}
      <Modal show={showTimerModal} onHide={() => setShowTimerModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cronômetro</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* SVG Circle Progress */}
          <div className={styles.progressContainer}>
            <svg className={styles.progressCircle} viewBox="0 0 36 36">
              <path
                className={styles.background}
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={styles.foreground}
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                strokeDasharray={`${calculateProgress()}, 100`}
              />
            </svg>
            <div className={styles.timerText}>
              {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          {running ? (
            <Button variant="warning" onClick={handlePause}>
              Pausar
            </Button>
          ) : (
            <Button variant="success" onClick={handleResume}>
              Retomar
            </Button>
          )}
          <Button variant="danger" onClick={handleFinalize}>
            Finalizar
          </Button>
        </Modal.Footer>
      </Modal>
            
      {/* Modal de Porcentagem */}
      <Modal show={showPercentageModal} onHide={() => setShowPercentageModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Atualizar Porcentagem</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="percentage">
              <Form.Label>Porcentagem de Conclusão</Form.Label>
              <Form.Control
                type="number"
                min="0"
                max="100"
                value={percentage}
                onChange={(e) => setPercentage(Number(e.target.value))}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPercentageModal(false)}>
            Cancelar
          </Button>
          <Button variant="success" onClick={handleSavePercentage}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MateriaList;