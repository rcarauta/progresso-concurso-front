import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveDisciplina, clearMessages } from '../../store/disciplinaSlice';
import styles from './DisciplinaForm.module.scss';
import { RootState } from '../../store/disciplinaStore';

const DisciplinaForm = () => {
  const dispatch = useDispatch();
  const { loading, successMessage, error } = useSelector((state: RootState) => state.disciplina);

  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState<'BASICA' | 'ESPECIFICA'>('BASICA');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const disciplina = {nome, categoria, porcentagem: 0, ciclos: 0};
    dispatch(saveDisciplina(disciplina));
  };

  useEffect(() => {
    if (successMessage || error) {
      setTimeout(() => {
        dispatch(clearMessages());
      }, 3000);
    }
  }, [successMessage, error, dispatch]);

  return (
    <div className={`container ${styles.disciplinaForm}`}>
      <h2 className="my-4">Nova Disciplina</h2>
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nome" className="form-label">
            Nome da Disciplina
          </label>
          <input
            type="text"
            className="form-control"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="categoria" className="form-label">
            Categoria
          </label>
          <select
            className="form-select"
            id="categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value as 'BASICA' | 'ESPECIFICA')}
          >
            <option value="BASICA">Básica</option>
            <option value="ESPECIFICA">Específica</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar Disciplina'}
        </button>
      </form>
    </div>
  );
};

export default DisciplinaForm;
