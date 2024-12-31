import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, ConcursoStore } from '../../../store/concursoStore';
import { saveConcurso } from '../../../store/concursoSlice';
import { RootState } from '../../../store/userStore';
import { fetchUsers } from '../../../store/userSlice';
import styles from './ContestForm.module.scss';

const ConcursoForm: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
  
    // Estado derivado do Redux
    const { users, loading: usersLoading } = useSelector((state: RootState) => state.users);
    const { loading: concursoLoading, error: concursoError } = useSelector(
      (state: ConcursoStore) => state.concurso
    );
  
    // Estado local para o formulário
    const [formData, setFormData] = useState({
      nome: '',
      dataProvaDate: '',
      percentualEstudadoFloat: '',
      userId: '',
    });
  
    useEffect(() => {
      dispatch(fetchUsers()); // Carrega a lista de usuários
    }, [dispatch]);
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
  
      // Validação de dados antes de enviar
      if (!formData.nome || !formData.dataProvaDate || !formData.percentualEstudadoFloat || !formData.userId) {
        alert('Preencha todos os campos.');
        return;
      }
  
      dispatch(
        saveConcurso({
            nome: formData.nome,
            dataProvaDate: formData.dataProvaDate,
            percentualEstudadoFloat: parseFloat(formData.percentualEstudadoFloat),
            userId: Number(formData.userId)
        })
      );
    };
  
    return (
      <div className={`container ${styles.formContainer}`}>
        <h1>Cadastro de Concurso</h1>
  
        {concursoError && <div className="alert alert-danger">Erro: {concursoError}</div>}
  
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nome</label>
            <input
              type="text"
              className="form-control"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </div>
  
          <div className="mb-3">
            <label className="form-label">Data da Prova</label>
            <input
              type="date"
              className="form-control"
              name="dataProvaDate"
              value={formData.dataProvaDate}
              onChange={handleChange}
              required
            />
          </div>
  
          <div className="mb-3">
            <label className="form-label">Percentual Estudado</label>
            <input
              type="number"
              step="0.1"
              className="form-control"
              name="percentualEstudadoFloat"
              value={formData.percentualEstudadoFloat}
              onChange={handleChange}
              required
            />
          </div>
  
          <div className="mb-3">
            <label className="form-label">Usuário</label>
            <select
              className="form-select"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              required
            >
              <option value="">Selecione um usuário</option>
              {usersLoading ? (
                <option>Carregando usuários...</option>
              ) : (
                users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))
              )}
            </select>
          </div>
  
          <button type="submit" className="btn btn-primary" disabled={concursoLoading}>
            {concursoLoading ? 'Salvando...' : 'Salvar'}
          </button>
        </form>
      </div>
    );
  };
  
  export default ConcursoForm;