import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listMaterias, updateMateria } from '../../store/materiaSlice';
import { useParams, Link } from 'react-router-dom';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import styles from './MateriaList.module.scss';

const MateriaList: React.FC = () => {
  const { concursoId, disciplinaId } = useParams<{ concursoId: string, disciplinaId: string }>();
  const dispatch = useDispatch();

  const { materias, loading, error } = useSelector((state: any) => state.materia);

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

  const handleStart = (materia: any) => {
    setCurrentMateria(materia);
    setShowTimerModal(true);
    setTimeRemaining(60 * 40); // Reset para 40 minutos
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

      dispatch(updateMateria(updatedMateria))
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

  const minutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
  };

  const calculateProgress = (): number => {
    return (timeRemaining / (60 * 40)) * 100;
  };

  return (
    <div className={styles.container}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Matérias Associadas</h1>
        <Link to={`/contest/table/${concursoId}/${disciplinaId}/materias/associar`}>
          <Button variant="primary">Associar Matéria</Button>
        </Link>
      </div>

      {loading && <p>Carregando...</p>}
      {error && <p className="text-danger">{error}</p>}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Porcentagem</th>
            <th>Tempo de Estudo (minutos)</th>
            <th>Cronômetro</th>
          </tr>
        </thead>
        <tbody>
          {materias && materias.length > 0 ? (
            materias.map((materia) => (
              <tr key={materia.id}>
                <td>{materia.nome}</td>
                <td>{materia.porcentagem}%</td>
                <td>{materia.tempoEstudo}</td>
                <td>
                  <Button variant="primary" onClick={() => handleStart(materia)}>
                    Iniciar
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center">
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
