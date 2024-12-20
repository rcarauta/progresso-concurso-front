import React, { useEffect, useState } from 'react';
import { Tab, Tabs, Table, ProgressBar, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { RootState } from '../../store/disciplinaStore';
import { fetchDisciplinasConcurso } from '../../store/disciplinaSlice';

const ContestTable: React.FC = () => {
  const [key, setKey] = useState<string>('disciplinas');
  const contestId = useParams();
  const dispatch = useDispatch();
  
  const {concurso, loading } = useSelector((state: RootState) => state.disciplina)

  const disciplinasBasicas = concurso?.listaDisciplinaRequest?.filter((disciplina) => disciplina.categoria == 'BASICA');

  const disciplinasEspecificas = concurso?.listaDisciplinaRequest?.filter((disciplina) => disciplina.categoria == 'ESPECIFICA')

  useEffect(() => {
    if (contestId.id) {
      dispatch(fetchDisciplinasConcurso(contestId.id));
    }
  }, [contestId.id, dispatch]);

  if (loading) {
    return <div>Carregando disciplinas...</div>;
  }

  return (
    <div className="container mt-4">
       <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>Gerenciamento de Disciplinas</h3>
            <Link to={`/contest/table/${contestId.id}/associar`}>
                <Button variant="primary">Adicionar Disciplina ao Concurso</Button>
            </Link>
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
        <Tab eventKey="outros" title="Outros">
          <div>
            {/* Conteúdo para outras abas (por exemplo, resumo, histórico, etc) */}
            <h5>Em breve, mais informações...</h5>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default ContestTable;
