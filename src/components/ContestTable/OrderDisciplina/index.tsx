import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'; 
import styles from './OrderDisciplina.module.scss';
import { fetchDisciplinasConcurso, ordenateDisciplina } from '../../../store/disciplinaSlice';
import { Button, Form, Row, Col, Card, Alert } from 'react-bootstrap';
import { AppDispatch, RootState } from '../../../store/disciplinaStore';
import { Disciplina } from '../../../models/Disciplina';

const OrderDisciplina: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    
    // Usando um objeto para armazenar o estado individual de ordem para cada disciplina
    const [ordens, setOrdens] = useState<{ [key: number]: number }>({});
    
    const concursoParam = useParams();
    const concursoId = concursoParam.id;  
    
    const { concurso, loading, error, successMessage } = useSelector((state: RootState) => state.disciplina);

    useEffect(() => {
      if (concursoId) {
        dispatch(fetchDisciplinasConcurso(concursoId));  
      }
    }, [dispatch, concursoId]);

    // Função que trata a mudança de ordem para uma disciplina específica
    const handleOrdenacaoChange = (e: React.ChangeEvent<HTMLInputElement>, disciplinaId: number | undefined) => {
      const value = parseInt(e.target.value, 10);
      
      if (value >= 1 && value <= 20) {
        setOrdens((prevOrdens) => ({
          ...prevOrdens,
          [disciplinaId == undefined ? 0 : disciplinaId]: value, // Atualizando o valor de ordem da disciplina específica
        }));
      }
    };
  
    // Função que envia a ordenação para o Redux
    const handleOrdenar = (disciplinaIdTemp: number | undefined) => {
      const disciplinaId: number = disciplinaIdTemp == undefined ? 0 : disciplinaIdTemp;
      const ordem = ordens[disciplinaId]; // Pegando o valor de ordem para a disciplina específica
      if (ordem !== undefined && concursoId) {
        dispatch(ordenateDisciplina({ idConcurso: Number(concursoId), disciplinaId, numeroOrdem: ordem }));
      }
    };

    // Exibe a mensagem de sucesso, se existir
    const renderSuccessMessage = () => {
      if (successMessage) {
        return <Alert variant="success">{successMessage}</Alert>;
      }
    };

    // Exibe a mensagem de erro, se existir
    const renderErrorMessage = () => {
      if (error) {
        return <Alert variant="danger">{error}</Alert>;
      }
    };

    return (
      <div className={styles.container}>
        <h2>Disciplinas do Concurso</h2>

        {/* Exibindo mensagens de sucesso e erro */}
        {renderSuccessMessage()}
        {renderErrorMessage()}

        {/* Status de Carregamento */}
        {loading && <p>Carregando disciplinas...</p>}

        {/* Lista de Disciplinas */}
        <Row>
          {concurso.listaDisciplinaRequest && concurso.listaDisciplinaRequest.length > 0 ? (
            concurso.listaDisciplinaRequest.map((disciplina: Disciplina) => (
              <Col key={disciplina.id} md={4} className="mb-4">
                <Card className="shadow-sm">
                  <Card.Body>
                    <Card.Title>{disciplina.nome}</Card.Title>
                    <Row className="align-items-center">
                      <Col xs={6}>
                        <Form.Control
                          type="number"
                          min="1"
                          max="20"
                          value={ordens[disciplina.id == undefined ? 0 : disciplina.id] || ''} // Pegando a ordem específica da disciplina
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleOrdenacaoChange(e, disciplina.id)} 
                          className="mb-2"
                          placeholder="Digite a ordem"
                        />
                      </Col>
                      <Col xs={6}>
                        <Button
                          variant="primary"
                          onClick={() => handleOrdenar(disciplina.id)}
                        >
                          Ordenar
                        </Button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col>
              <p>Não há disciplinas para exibir.</p>
            </Col>
          )}
        </Row>
      </div>
    );
};

export default OrderDisciplina;
