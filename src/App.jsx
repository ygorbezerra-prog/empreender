import React, { useState } from 'react';
import Login from './components/Login';
import Home from './Home';
import Painel from './Painel';
// import Painel from './Painel'; // descomente para testar o painel

function App() {
  const [logado, setLogado] = useState(true); // false = começa no login

  if (!logado) {
    return <Login onLoginSucesso={() => setLogado(true)} />;
  }

  return <Painel onSair={() => setLogado(false)} />;
  // Para ver o painel: return <Painel onSair={() => setLogado(false)} />;
}

export default App;