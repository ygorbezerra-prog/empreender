import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Home from './Home';
import Painel from './Painel';

function App() {
  const [logado, setLogado] = useState(true); // true só para testar sem backend
  const navigate = useNavigate();

  const entrar = () => {
    setLogado(true);
    navigate('/');
  };

  const sair = () => {
    setLogado(false);
    navigate('/login');
  };

  return (
    <Routes>
      <Route path="/login" element={<Login onLoginSucesso={entrar} />} />

      <Route
        path="/"
        element={logado ? <Home onSair={sair} /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/inscricoes/:tipo"
        element={logado ? <Painel onSair={sair} /> : <Navigate to="/login" replace />}
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;