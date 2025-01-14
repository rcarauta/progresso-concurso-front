import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPercentages } from '../../store/porcentagemSlice';
import styles from './DisciplinaPorcentagem.module.scss'; 
import { AppDispatch, PorcentagemDisciplinaState } from '../../store/porcentagemStore';

const DisciplinaPorcentagem:  React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { disciplinas, percentages, loading, error } = useSelector((state: PorcentagemDisciplinaState) => state.porcentagemDisciplina);

  const [selectedDisciplina, setSelectedDisciplina] = useState('');

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const disciplina = event.target.value;
    setSelectedDisciplina(disciplina);
    dispatch(fetchPercentages(disciplina));
  };

  return (
    <div className={`container ${styles.appContainer}`}>
      <h1 className="text-center my-4">Disciplinas Porcentagem %</h1>

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

      {/* Display percentages */}
      {percentages && (
        <div className="mt-4">
          <h2 className="text-success">Percentagens para {selectedDisciplina}</h2>
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Total Questões</th>
                <th>Porcentagem</th>
              </tr>
            </thead>
            <tbody>
              {percentages.map((item, index) => (
                <tr key={index}>
                  <td>{item.title}</td>
                  <td>{item.questoes_count}</td>
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

export default DisciplinaPorcentagem;
