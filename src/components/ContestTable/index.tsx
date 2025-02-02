import React, { useEffect, useState } from 'react';
import { Tab, Tabs, Table, ProgressBar, Button, Row, Col, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store/disciplinaStore';
import { RootState as AuthState } from '../../store/authStore';
import { fetchDisciplinasConcurso, 
  fetchDisciplinasOrdemConcurso,
  updateCiclosDisciplinaConcurso,
  deletarDisciplinasConcurso } from '../../store/disciplinaSlice';

import { fetchDisciplinaMateria } from '../../store/disciplinaMateriaSlice';
import { DisciplinaMateria } from '../../models/DisciplinaMateria';
import { hasAdminRole } from '../../utils/decodeToken';

const ContestTable: React.FC = () => {
  const [key, setKey] = useState<string>('disciplinas');
  const contestId = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const { token } = useSelector((state: AuthState) => state.auth);
  const [cicloValues, setCicloValues] = useState<Record<number, number>>({});

  const [disciplinasMateria, setDisciplinasMateria] = useState<DisciplinaMateria[]>([]);
  
  const {concurso, loading } = useSelector((state: RootState) => state.disciplina)

  const disciplinasBasicasTemp = concurso?.listaDisciplinaRequest?.filter((disciplina) => disciplina.categoria == 'BASICA');

  const disciplinasBasicas = disciplinasBasicasTemp == undefined ? [] : disciplinasBasicasTemp;

  const disciplinasEspecificasTemp = concurso?.listaDisciplinaRequest?.filter((disciplina) => disciplina.categoria == 'ESPECIFICA')

  const disciplinasEspecificas = disciplinasEspecificasTemp == undefined ? [] : disciplinasEspecificasTemp;


  useEffect(() => {
    if (contestId.id && key === 'totalQuestoes') {
      dispatch(fetchDisciplinaMateria({ concursoId: contestId.id }))
        .unwrap()
        .then((data) => {
          console.log(data); 
          setDisciplinasMateria(data);
        })
        .catch((error) => console.error('Erro ao buscar disciplinas:', error));
    }
  }, [contestId.id, dispatch, key]);

  useEffect(() => {
    if (contestId.id && key === 'outros') {
      dispatch(fetchDisciplinasOrdemConcurso(contestId.id));
    }
  }, [contestId.id, dispatch, key]);

  useEffect(() => {
    if (contestId.id && key == 'disciplinas') {
      dispatch(fetchDisciplinasConcurso(contestId.id));
    }
  }, [contestId.id, dispatch, key]);

  if (loading) {
    return <div>Carregando disciplinas...</div>;
  }


  // Função para exibir as disciplinas ordenadas
  const renderDisciplinasOrdenadas = () => {
    return (
      <Row>
        {concurso.listaDisciplinaRequest && concurso.listaDisciplinaRequest.length > 0 ? (
          concurso.listaDisciplinaRequest.map((disciplina) => (
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

  const deletarDisciplina = (disciplinaIdTemp: number | undefined) => {
      const disciplinaId = disciplinaIdTemp == undefined ? 0 : disciplinaIdTemp;
      const id = contestId.id == undefined ? 0 : contestId.id; 
      dispatch(deletarDisciplinasConcurso({concursoId: +id, disciplinaId: +disciplinaId}));
  }

  const renderDisciplinasMateria = () => {
    const disciplinasMateriaBasicas = disciplinasMateria?.filter((disciplina) => disciplina.categoria === 'BASICA');
    const disciplinasMateriaEspecificas = disciplinasMateria?.filter((disciplina) => disciplina.categoria === 'ESPECIFICA');
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Disciplina</th>
            <th>Total de Questões</th>
            <th>Questões Acertadas</th>
            <th>Porcentagem</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={4} className="text-center"><strong>Disciplinas Básicas</strong></td>
          </tr>
          {disciplinasMateriaBasicas.map((disciplina) => (
            <tr key={disciplina.nome}>
              <td>{disciplina.nome}</td>
              <td>{disciplina.totalQuestoes}</td>
              <td>{disciplina.questoesAcertadas}</td>
              <td className={getBackgroundClass(disciplina.totalQuestoes, disciplina.questoesAcertadas)}>
                {(disciplina.questoesAcertadas / disciplina.totalQuestoes * 100).toFixed(2)}%
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan={4} className="text-center"><strong>Disciplinas Específicas</strong></td>
          </tr>
          {disciplinasMateriaEspecificas.map((disciplina) => (
            <tr key={disciplina.nome}>
              <td>{disciplina.nome}</td>
              <td>{disciplina.totalQuestoes}</td>
              <td>{disciplina.questoesAcertadas}</td>
              <td className={getBackgroundClass(disciplina.totalQuestoes, disciplina.questoesAcertadas)}>
                {(disciplina.questoesAcertadas / disciplina.totalQuestoes * 100).toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }

  const handleInputChange = (disciplinaId: number | undefined, value: number) => {
    setCicloValues((prevValues) => ({ ...prevValues, [disciplinaId == undefined ? 0 : disciplinaId]: value }));
  };


  const handleCicloUpdate = (disciplinaIdTemp: number | undefined) => {
    const disciplinaId = disciplinaIdTemp == undefined ? 0 : disciplinaIdTemp;
    const ciclos = cicloValues[disciplinaId];
    if (contestId.id && ciclos !== undefined) {
      dispatch(
        updateCiclosDisciplinaConcurso({
          idConcurso: Number(contestId.id),
          disciplinaId,
          ciclos,
        })
      );
    }
  };

  const getBackgroundClass = (totalQuestoes: number, questoesAcertadas: number): string => {
    if (totalQuestoes === 0) return 'bg-secondary'; // Cor neutra para casos sem questões
    const porcentagem = (questoesAcertadas / totalQuestoes) * 100;
    if (porcentagem < 70) return 'bg-danger';
    if (porcentagem <= 75) return 'bg-warning';
    return 'bg-success';
  };


  return (
    <div className="container mt-4">
       <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>Gerenciamento de Disciplinas</h3>
          <div>
            {hasAdminRole(token) && (<Link to={`/contest/table/${contestId.id}/associar`}>
                <Button variant="primary">Adicionar Disciplina ao Concurso</Button>
            </Link>)}
            {/* Link para Ordenar Disciplinas ao Concurso */}
             {hasAdminRole(token) && (<Link to={`/contest/table/${contestId.id}/ordenar`}>
                <Button variant="secondary">Ordenar Disciplina ao Concurso</Button>
            </Link>)}
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
                <th>Ações</th>
                {hasAdminRole(token) && ( <th>Deletar Disciplina</th> )}
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
                    <td>
                      <input
                        type="number"
                        defaultValue={disciplina.ciclos}
                        onChange={(e) => handleInputChange(disciplina.id, parseInt(e.target.value))}
                        style={{ width: '60px' }}
                      />
                    </td>
                    <td>
                      <Button
                        variant="success"
                        onClick={() => handleCicloUpdate(disciplina.id)}>
                        Atualizar
                      </Button>
                    </td>
                    {hasAdminRole(token) &&  ( <td>
                      <Button
                        variant="danger"
                        onClick={() => deletarDisciplina(disciplina.id)}>
                        Deletar
                      </Button>
                    </td> )}
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
                    <td>
                      <input
                          type="number"
                          defaultValue={disciplina.ciclos}
                          onChange={(e) => handleInputChange(disciplina.id, parseInt(e.target.value))}
                          style={{ width: '60px' }}
                        />
                    </td>
                    <td>
                      <Button
                          variant="success"
                          onClick={() => handleCicloUpdate(disciplina.id)}
                        >
                          Atualizar
                      </Button>
                    </td>
                    {hasAdminRole(token) &&  ( <td>
                      <Button
                        variant="danger"
                        onClick={() => deletarDisciplina(disciplina.id)}>
                        Deletar
                      </Button>
                    </td> )}
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

        {/*Aba para verificar questões totais por disciplina*/}
        <Tab eventKey="totalQuestoes" title="Total Questões">
          {renderDisciplinasMateria()}
        </Tab>

      </Tabs>
    </div>
  );
};

export default ContestTable;
