import React, { useState } from 'react';
import './Login.css';
import { login } from '../services/authService';

function Login({ onLoginSucesso }) {
  const [credencial, setCredencial] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const dados = await login(credencial, senha);
      onLoginSucesso?.(dados);
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="login-pagina">
      <div className="login-card">
        <div className="login-faixa"></div>

        <div className="p-4 p-md-5">
          <div className="text-center mb-4">
            <div className="login-logo mb-3">
              <i className="bi bi-shield-lock-fill"></i>
            </div>
            <div className="login-orgao">Empreender Paraíba</div>
            <h4 className="fw-bold mb-0">Controle de Inscrições</h4>
            <p className="text-muted small mt-1 mb-0">Acesso restrito</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="credencial" className="form-label small fw-semibold text-secondary">
                Usuário
              </label>
              <input
                id="credencial"
                type="text"
                className="form-control form-control-lg"
                autoComplete="username"
                value={credencial}
                onChange={(e) => setCredencial(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="senha" className="form-label small fw-semibold text-secondary">
                Senha
              </label>
              <input
                id="senha"
                type="password"
                className="form-control form-control-lg"
                autoComplete="current-password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>

            {erro && (
              <div className="alert alert-danger py-2 small" role="alert">
                {erro}
              </div>
            )}

            <button type="submit" className="btn btn-login btn-lg w-100" disabled={carregando}>
              {carregando ? 'Entrando...' : 'Entrar no Sistema'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;