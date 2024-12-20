import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listMaterias } from '../../store/materiaSlice';
import { useParams, Link } from 'react-router-dom';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import styles from './MateriaList.module.scss';

const MateriaList: React.FC = () => {
  const { concursoId, disciplinaId } = useParams<{ concursoId: string, disciplinaId: string }>();
  const dispatch = useDispatch();

  const { materias, loading, error } = useSelector((state: any) => state.materia);

  const [showModal, setShowModal] = useState(false);
  const [currentMateria, setCurrentMateria] = useState<any>(null);
  const [percentage, setPercentage] = useState<number>(0);
  const [runningTimers, setRunningTimers] = useState<{ [id: number]: boolean }>({});
  const [intervalRefs, setIntervalRefs] = useState<{ [id: number]: number | null }>({});
  const [timeRemaining, setTimeRemaining] = useState<{ [id: number]: number }>({});

  // Inicializa o tempo restante para cada matéria
  useEffect(() => {
    if (materias && materias.length > 0) {
      const initialTimes = materias.reduce((acc: any, materia: any) => {
        acc[materia.id] = 40 * 60; // 40 minutos em segundos
        return acc;
      }, {});
      setTimeRemaining(initialTimes);
    }
  }, [materias]);

  // Iniciar o cronômetro
  const startTimer = (materia: any) => {
    const id = materia.id;

    if (runningTimers[id]) return; // Evita múltiplos timers para a mesma matéria

    setRunningTimers((prev) => ({ ...prev, [id]: true }));

    const intervalId = window.setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev[id] - 1;

        if (newTime <= 0) {
          clearInterval(intervalRefs[id]!);
          setIntervalRefs((prevRefs) => ({ ...prevRefs, [id]: null }));
          setRunningTimers((prevRunning) => ({ ...prevRunning, [id]: false }));

          // Atualizar o tempo total de estudo ao final
          materia.tempoEstudo += 40; // Adiciona 40 minutos
          alert(`Cronômetro finalizado para ${materia.nome}!`);
          return { ...prev, [id]: 0 };
        }

        return { ...prev, [id]: newTime };
      });
    }, 1000);

    setIntervalRefs((prev) => ({ ...prev, [id]: intervalId }));
  };

  // Pausar o cronômetro
  const pauseTimer = (materia: any) => {
    const id = materia.id;
    if (runningTimers[id] && intervalRefs[id] !== null) {
      clearInterval(intervalRefs[id]!);
      setIntervalRefs((prev) => ({ ...prev, [id]: null }));
      setRunningTimers((prev) => ({ ...prev, [id]: false }));
    }
  };

  // Retomar o cronômetro
  const resumeTimer = (materia: any) => {
    const id = materia.id;
    if (!runningTimers[id] && timeRemaining[id] > 0) {
      startTimer(materia);
    }
  };

  // Formatar o tempo no estilo mm:ss
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Abrir o modal para atualizar porcentagem
  const openModal = (materia: any) => {
    setCurrentMateria(materia);
    setShowModal(true);
  };

  // Fechar o modal
  const closeModal = () => {
    setShowModal(false);
    setPercentage(0);
  };

  // Atualizar a porcentagem e o tempo total de estudo
  const handleSavePercentage = () => {
    if (currentMateria) {
      const updatedMateria = {
        ...currentMateria,
        porcentagem: percentage,
      };

      console.log('Atualizando matéria:', updatedMateria);
      closeModal();
    }
  };

  useEffect(() => {
    if (concursoId && disciplinaId) {
      dispatch(listMaterias({ concursoId: +concursoId, disciplinaId: +disciplinaId }));
    }
  }, [concursoId, disciplinaId, dispatch]);

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
                  {formatTime(timeRemaining[materia.id] || 0)}{' '}
                  {runningTimers[materia.id] ? (
                    <Button variant="warning" onClick={() => pauseTimer(materia)}>
                      Pausar
                    </Button>
                  ) : (
                    <Button variant="success" onClick={() => resumeTimer(materia)}>
                      Retomar
                    </Button>
                  )}
                  <Button
                    variant="primary"
                    onClick={() => startTimer(materia)}
                    disabled={runningTimers[materia.id]}
                  >
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

      <Modal show={showModal} onHide={closeModal}>
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
          <Button variant="secondary" onClick={closeModal}>
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
