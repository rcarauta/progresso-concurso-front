import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/userStore';
import { clearSuccessMessage, createUser } from '../../store/userSlice';
import styles from './FormUsuario.module.scss';

const UserForm: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [enabled, setEnabled] = useState(true);

    const dispatch = useDispatch<AppDispatch>();
    const { loading, error, successMessage } = useSelector((state: RootState) => state.users);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newUser = { username, password, enabled };
        dispatch(createUser(newUser));
    };

    const handleCloseMessage = () => {
        dispatch(clearSuccessMessage()); // Limpa a mensagem de sucesso ao fechar
    };

    return (
        <div className={styles.userFormContainer}>
            <h2>Cadastro de Usuário</h2>
            <form onSubmit={handleSubmit} className={styles.userForm}>
                <div className="mb-3">
                    <label htmlFor="username" className={styles.formLabel}>
                        Nome de Usuário
                    </label>
                    <input
                        type="text"
                        id="username"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className={styles.formLabel}>
                        Senha
                    </label>
                    <input
                        type="password"
                        id="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3 form-check">
                    <input
                        type="checkbox"
                        id="enabled"
                        className="form-check-input"
                        checked={enabled}
                        onChange={(e) => setEnabled(e.target.checked)}
                    />
                    <label htmlFor="enabled" className="form-check-label">
                        Usuário Ativo
                    </label>
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Salvando...' : 'Salvar'}
                </button>
                {error && <div className="alert alert-danger mt-3">{error}</div>}
            </form>
            {successMessage && (
                <div className="alert alert-success mt-3">
                    {successMessage}
                    <button type="button" className="close" onClick={handleCloseMessage}>
                        &times;
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserForm;
