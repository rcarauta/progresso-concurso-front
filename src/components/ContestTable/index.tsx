import React, { useState } from 'react';
import { Tab, Tabs, Table, ProgressBar, Button } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';

const ContestTable: React.FC = () => {
  const [key, setKey] = useState<string>('disciplinas');
  const contestId = useParams();
  // Dados mock para as disciplinas
  const disciplinasBasicas = [
    { nome: 'Matemática', progresso: 60, ciclosCompletos: 5 },
    { nome: 'Português', progresso: 80, ciclosCompletos: 7 },
    { nome: 'Raciocínio Lógico', progresso: 40, ciclosCompletos: 3 },
  ];

  const disciplinasEspecificas = [
    { nome: 'Direito Constitucional', progresso: 70, ciclosCompletos: 6 },
    { nome: 'Direito Administrativo', progresso: 50, ciclosCompletos: 4 },
    { nome: 'Legislação Específica', progresso: 90, ciclosCompletos: 8 },
  ];

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
                  <td>{disciplina.nome}</td>
                  <td>
                    <ProgressBar now={disciplina.progresso} label={`${disciplina.progresso}%`} />
                  </td>
                  <td>{disciplina.ciclosCompletos}</td>
                </tr>
              ))}
              <tr>
                <td colSpan={3} className="text-center"><strong>Disciplinas Específicas</strong></td>
              </tr>
              {disciplinasEspecificas.map((disciplina, index) => (
                <tr key={index}>
                  <td>{disciplina.nome}</td>
                  <td>
                    <ProgressBar now={disciplina.progresso} label={`${disciplina.progresso}%`} />
                  </td>
                  <td>{disciplina.ciclosCompletos}</td>
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
