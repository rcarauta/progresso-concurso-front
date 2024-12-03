import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';
import LoginForm from './components/LoginForm';
import ContestList from './components/ContestsList';
import Header from './components/Header';
import ContestTable from './components/ContestTable';

const App: React.FC = () => {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/home" element={isLoggedIn ? <ContestList /> : <Navigate to="/login" />} />
        <Route path="/contests" element={isLoggedIn ? <ContestList /> : <Navigate to="/login" />} />
        <Route path="/contests/table" element={isLoggedIn ? <ContestTable /> : <Navigate to="/login" />} />
        <Route path="*" element={<div>Página não encontrada!</div>} />
      </Routes>
    </Router>
  );
};

export default App;

