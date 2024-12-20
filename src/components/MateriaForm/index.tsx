import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';

import styles from './MateriaForm.module.scss'; // Importa o módulo SCSS
import { Materia } from '../../models/Materia';
import { saveMateria } from '../../store/materiaSlice';

const MateriaForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, sucessMessage } = useSelector((state: RootState) => state.materia);

  const [formData, setFormData] = useState<Materia>({
    id: null,
    nome: '',
    porcentagem: 0,
    tempoEstudo: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'porcentagem' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(saveMateria(formData));   
  };

  return (
    <div className={`container ${styles.container}`}>
      <h1 className="text-center mb-4">Cadastrar Matéria</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label htmlFor="nome">Nome da Matéria</label>
          <input
            type="text"
            className="form-control"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            placeholder="Digite o nome da matéria"
            required
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="porcentagem">Porcentagem</label>
          <input
            type="number"
            className="form-control"
            id="porcentagem"
            name="porcentagem"
            value={formData.porcentagem}
            onChange={handleChange}
            step="0.01"
            placeholder="Digite a porcentagem"
            required
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="tempoEstudo">Tempo de Estudo (HH:mm:ss)</label>
          <input
            type="time"
            className="form-control"
            id="tempoEstudo"
            name="tempoEstudo"
            value={formData.tempoEstudo}
            onChange={handleChange}
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? 'Salvando...' : 'Salvar'}
        </button>

        {sucessMessage && (
          <p className={`mt-3 text-center ${styles.successMessage}`}>
            {sucessMessage}
          </p>
        )}

        {error && (
          <p className={`mt-3 text-center ${styles.errorMessage}`}>
            Erro: {error}
          </p>
        )}
      </form>
    </div>
  );
};

export default MateriaForm;
