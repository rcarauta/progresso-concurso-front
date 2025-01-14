import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUsers } from '../../store/userSlice';
import styles from './ListUsuario.module.scss';
import { AppDispatch, RootState } from '../../store/userStore';
import { User } from '../../models/User';

const UserList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error } = useSelector((state: RootState) => state.users);
  const navigate = useNavigate();

  const userNovo = () => {
    navigate("/user/novo");
  }

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error}</p>;

  return (
    <div className={`container ${styles.userList}`}>
      <h2 className="my-4">Lista de Usuários</h2>
      <div className="mb-3">
        <button 
          className="btn btn-primary" 
          onClick={userNovo}
        >
          Adicionar Novo Usuário
        </button>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>username</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: User) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
