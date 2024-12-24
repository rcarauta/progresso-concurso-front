import React, { useEffect, useState } from 'react';
import { Tab, Tabs, Table, ProgressBar, Button, Row, Col, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { RootState } from '../../store/disciplinaStore';
import { fetchDisciplinasConcurso, fetchDisciplinasOrdemConcurso  } from '../../store/disciplinaSlice';

const ContestTable: React.FC = () => {
  const [key, setKey] = useState<string>('disciplinas');
  const contestId = useParams();
  const dispatch = useDispatch();
  
  const {concurso, loading } = useSelector((state: RootState) => state.disciplina)

  const disciplinasBasicas = concurso?.listaDisciplinaRequest?.filter((disciplina) => disciplina.categoria == 'BASICA');

  const disciplinasEspecificas = concurso?.listaDisciplinaRequest?.filter((disciplina) => disciplina.categoria == 'ESPECIFICA')


  useEffect(() => {
    if (contestId.id && key === 'outros') {
      dispatch(fetchDisciplinasOrdemConcurso(contestId.id));
    }
  }, [contestId.id, dispatch, key]);

  useEffect(() => {
    if (contestId.id) {
      dispatch(fetchDisciplinasConcurso(contestId.id));
    }
  }, [contestId.id, dispatch]);

  if (loading) {
    return <div>Carregando disciplinas...</div>;
  }


  // Função para exibir as disciplinas ordenadas
  const renderDisciplinasOrdenadas = () => {
    return (
      <Row>
        {concurso.listaDisciplinaRequest && concurso.listaDisciplinaRequest.length > 0 ? (
          concurso.listaDisciplinaRequest.map((disciplina, index) => (
            <Col key={disciplina.id} md={6} className="mb-4">
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>{disciplina.nome}</Card.Title>
                  <p>Categorias: {disciplina.categoria}</p>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <p>Não há disciplinas para exibir na ordem.</p>
          </Col>
        )}
      </Row>
    );
  };


  return (
    <div className="container mt-4">
       <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>Gerenciamento de Disciplinas</h3>
          <div>
            <Link to={`/contest/table/${contestId.id}/associar`}>
                <Button variant="primary">Adicionar Disciplina ao Concurso</Button>
            </Link>
            {/* Link para Ordenar Disciplinas ao Concurso */}
            <Link to={`/contest/table/${contestId.id}/ordenar`}>
                <Button variant="secondary">Ordenar Disciplina ao Concurso</Button>
            </Link>
          </div>
        </div>

      <Tabs
        id="disciplinas-tabela"
        activeKey={key}
        onSelect={(k) => setKey(k as string)}
        className="mb-3"
      >
        {/* Aba de Disciplinas */}
        <Tab eventKey="disciplinas" title="Disciplinas">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Disciplina</th>
                <th>Progresso</th>
                <th>Ciclos Completos</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={3} className="text-center"><strong>Disciplinas Básicas</strong></td>
              </tr>
              {disciplinasBasicas.map((disciplina, index) => (
                <tr key={index}>
                    <td>
                      <Link to={`/contest/table/${contestId.id}/${disciplina.id}/materias`}>
                          {disciplina.nome}
                      </Link>
                    </td>
                    <td>
                      <ProgressBar now={disciplina.porcentagem} label={`${disciplina.porcentagem}%`} />
                    </td>
                    <td>{disciplina.ciclos}</td>
                </tr>
              ))}
              <tr>
                <td colSpan={3} className="text-center"><strong>Disciplinas Específicas</strong></td>
              </tr>
              {disciplinasEspecificas.map((disciplina, index) => (
                <tr key={index}> 
                    <td>
                      <Link to={`/contest/table/${contestId.id}/${disciplina.id}/materias`}>
                        {disciplina.nome}
                      </Link>
                    </td>
                    <td>
                      <ProgressBar now={disciplina.porcentagem} label={`${disciplina.porcentagem}%`} />
                    </td>
                    <td>{disciplina.ciclos}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>

        {/* Mais Abas podem ser adicionadas no futuro */}
        <Tab eventKey="outros" title="Ordem de Estudo">
          <div>
            <h5>Disciplinas em Ordem</h5>
            {renderDisciplinasOrdenadas()}
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default ContestTable;
