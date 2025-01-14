import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listConcursos, cloneConcurso } from '../../store/concursoSlice';
import { fetchUsers } from '../../store/userSlice';
import { Form, Button } from 'react-bootstrap';
import { RootState } from '../../store/userStore';
import { AppDispatch, ConcursoStore } from '../../store/concursoStore';
import styles from './CloneContest.module.scss';

const ConcursoClone = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { concursos } = useSelector((state: ConcursoStore) => state.concurso);
  const { users } = useSelector((state: RootState) => state.users);

  const [selectedConcurso, setSelectedConcurso] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [concursoFilter, setConcursoFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');

  useEffect(() => {
    dispatch(listConcursos());
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleClone = () => {
    if (selectedConcurso && selectedUser) {
      dispatch(cloneConcurso({ concursoId: +selectedConcurso, userId: +selectedUser }));
    } else {
      alert('Por favor, selecione um concurso e um usuário.');
    }
  };

  return (
    <div className={styles.container}>
      <Form.Group controlId="concursoSelect">
        <Form.Label>Selecione o Concurso</Form.Label>
        <Form.Control
          type="text"
          placeholder="Filtrar concursos"
          value={concursoFilter}
          onChange={(e) => setConcursoFilter(e.target.value)}
        />
        <Form.Control
          as="select"
          value={selectedConcurso}
          onChange={(e) => setSelectedConcurso(e.target.value)}
        >
          <option value="">Selecione...</option>
          {concursos
            .filter((concurso) =>
              concurso.nome.toLowerCase().includes(concursoFilter.toLowerCase())
            )
            .map((concurso) => (
              <option key={concurso.id} value={concurso.id}>
                {concurso.nome}
              </option>
            ))}
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="userSelect">
        <Form.Label>Selecione o Usuário</Form.Label>
        <Form.Control
          type="text"
          placeholder="Filtrar usuários"
          value={userFilter}
          onChange={(e) => setUserFilter(e.target.value)}
        />
        <Form.Control
          as="select"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option value="">Selecione...</option>
          {users
            .filter((user) =>
              user.username.toLowerCase().includes(userFilter.toLowerCase())
            )
            .map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
        </Form.Control>
      </Form.Group>

      <Button variant="primary" onClick={handleClone}>
        Salvar
      </Button>
    </div>
  );
};

export default ConcursoClone;
