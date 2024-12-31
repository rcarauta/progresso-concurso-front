import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, loginAsUser } from '../../store/userSlice';
import { RootState } from '../../store/userStore';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import styles from './LoginAsUser.module.scss';

const LoginAsUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state:RootState) => state.users);
  const [selectedUsername, setSelectedUsername] = useState('');

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleLoginAsUser = () => {
    if (selectedUsername) {
      dispatch(loginAsUser(selectedUsername))
        .then(() => {
          navigate('/contests');
        })
        .catch((error) => {
          console.error('Erro ao efetuar login como outro usuário:', error);
        });
    } else {
      alert('Por favor, selecione um usuário.');
    }
  };

  return (
    <Container className={`d-flex justify-content-center align-items-center ${styles.fullHeight}`}>
    <Row className="w-100">
      <Col xs={12} md={6} lg={4} className="mx-auto">
        <div className={`p-4 shadow-sm rounded ${styles.formContainer}`}>
          <h2 className="text-center mb-4">Entrar como Outro Usuário</h2>
          <Form.Group controlId="userSelect">
            <Form.Label>Selecione o Usuário</Form.Label>
            <Form.Control
              as="select"
              value={selectedUsername}
              onChange={(e) => setSelectedUsername(e.target.value)}
            >
              <option value="">Selecione...</option>
              {user.users.map((user) => (
                <option key={user.username} value={user.username}>
                  {user.username}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Button
            variant="primary"
            onClick={handleLoginAsUser}
            className="w-100 mt-3"
          >
            Entrar
          </Button>
        </div>
      </Col>
    </Row>
  </Container>
  );
};

export default LoginAsUser;
