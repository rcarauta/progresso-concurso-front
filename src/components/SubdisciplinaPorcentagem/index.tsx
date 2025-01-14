import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSubtopicsPercentages } from '../../store/porcentagemSlice';
import styles from './SubdisciplinaPorcentagem.module.scss'; 
import { AppDispatch, PorcentagemDisciplinaState } from '../../store/porcentagemStore';

const SubtopicosPorcentagem: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { disciplinas, subtopics, loading, error } = useSelector((state: PorcentagemDisciplinaState) => state.porcentagemDisciplina);

  const [selectedDisciplina, setSelectedDisciplina] = useState('');

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const disciplina = event.target.value;
    setSelectedDisciplina(disciplina);
    dispatch(fetchSubtopicsPercentages(disciplina));
  };

  return (
    <div className={`container ${styles.appContainer}`}>
      <h1 className="text-center my-4">Subtópicos Porcentagem %</h1>

      {/* Dropdown for selecting disciplina */}
      <div className="mb-3">
        <label htmlFor="disciplinaSelect" className="form-label">
          Selecione a Disciplina:
        </label>
        <select
          id="disciplinaSelect"
          value={selectedDisciplina}
          onChange={handleSelectChange}
          className="form-select"
        >
          <option value="" disabled>Selecione uma disciplina</option>
          {disciplinas.map((disciplina, index) => (
            <option key={index} value={disciplina}>
              {disciplina}
            </option>
          ))}
        </select>
      </div>

      {/* Display loading state */}
      {loading && <p className="text-primary">Carregando...</p>}

      {/* Display error */}
      {error && <p className="text-danger">Erro: {error}</p>}

      {/* Display subtopics */}
      {subtopics && (
        <div className="mt-4">
          <h2 className="text-success">Subtópicos para {selectedDisciplina}</h2>
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Nome do Subtópico</th>
                <th>Tópico</th>
                <th>Questões</th>
                <th>Porcentagem</th>
              </tr>
            </thead>
            <tbody>
              {subtopics.map((item, index) => (
                <tr key={index}>
                  <td>{item.nested_subject_name}</td>
                  <td>{item.topic_name}</td>
                  <td>{item.questoes_value}</td>
                  <td>{item.percentage.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default SubtopicosPorcentagem;
