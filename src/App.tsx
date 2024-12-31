import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store/authStore';
import LoginForm from './components/LoginForm';
import ContestList from './components/ContestsList';
import Header from './components/Header';
import ContestTable from './components/ContestTable';
import UserForm from './components/FormUsuario';
import UserList from './components/ListUsuario';
import DisciplinaForm from './components/DisciplinaForm/inde';
import ListAssociateDisciplina from './components/ContestTable/ListAssociateDisciplina';
import MateriaForm from './components/MateriaForm';
import MateriaList from './components/MateriaList';
import AssociarMaterias from './components/MateriaList/ListAssociateMateria';
import OrderDisciplina from './components/ContestTable/OrderDisciplina';
import ConcursoForm from './components/ContestTable/ContestForm';
import ConcursoClone from './components/CloneContest';
import LoginAsUser from './components/LoginAsUser';
import { hasAdminRole } from './utils/decodeToken';

const App: React.FC = () => {
  const {token, isLoggedIn } = useSelector((state: RootState) => state.auth);

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/home" element={isLoggedIn ? <ContestList /> : <Navigate to="/login" />} />
        {hasAdminRole(token) &&<Route path="/user" element={isLoggedIn ? <UserList /> : <Navigate to="/login" />} /> }
        {hasAdminRole(token) &&<Route path="/user/novo" element={isLoggedIn ? <UserForm /> : <Navigate to="/login" />} /> }
        {hasAdminRole(token) && <Route path="/user/enter" element={isLoggedIn ? <LoginAsUser /> : <Navigate to="/login" />} /> }
        {hasAdminRole(token) && <Route path="/disciplina/novo" element={isLoggedIn ? <DisciplinaForm />: <Navigate to="/login" />} />}
        {hasAdminRole(token) &&<Route path="/materia/novo" element={isLoggedIn ? <MateriaForm /> : <Navigate to="/login" />} /> }
        <Route path="/contests" element={isLoggedIn ? <ContestList /> : <Navigate to="/login" />} />
        {hasAdminRole(token) && <Route path="/contests/clonar" element={isLoggedIn ? <ConcursoClone /> : <Navigate to="/login" />} /> }
        {hasAdminRole(token) && <Route path="/contests/novo" element={isLoggedIn ? <ConcursoForm /> : <Navigate to="/login" />} /> }
        <Route path="/contests/table/:id" element={isLoggedIn ? <ContestTable /> : <Navigate to="/login" />} />
        {hasAdminRole(token) && <Route path="/contest/table/:id/associar" element={isLoggedIn ? <ListAssociateDisciplina /> : <Navigate to="/login" /> } /> }
        {hasAdminRole(token) && <Route path="/contest/table/:id/ordenar" element={isLoggedIn ? <OrderDisciplina /> : <Navigate to="/login" />} /> }
        <Route path="/contest/table/:concursoId/:disciplinaId/materias" element={isLoggedIn ? <MateriaList /> : <Navigate to="/login" />} />
        {hasAdminRole(token) &&<Route path="/contest/table/:concursoId/:disciplinaId/materias/associar" element={isLoggedIn ? <AssociarMaterias /> : <Navigate to="/login" />} /> }
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;

