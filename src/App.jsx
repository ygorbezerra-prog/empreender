import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Home from './Home';
import PainelAgrupado from './PainelAgrupado';

function App() {
  // Agora guardamos o objeto inteiro do usuário (nome, perfil, etc.)
 const [usuarioLogado, setUsuarioLogado] = useState({
    id: 2,
    nome: 'João (Estágio)',
    perfil: 'ESTAGIARIO', 
    token: 'token-fake-estag'
  });
  const navigate = useNavigate();

  const entrar = (dadosUsuario) => {
    setUsuarioLogado(dadosUsuario);
    navigate('/');
  };

  const sair = () => {
    setUsuarioLogado(null);
    navigate('/login');
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={usuarioLogado ? <Navigate to="/" replace /> : <Login onLoginSucesso={entrar} />}
      />

      <Route
        path="/"
        element={usuarioLogado ? <Home onSair={sair} usuario={usuarioLogado} /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/inscricoes/:tipo"
        element={usuarioLogado ? <PainelAgrupado onSair={sair} usuario={usuarioLogado} /> : <Navigate to="/login" replace />}
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;