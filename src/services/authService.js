const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

export async function login(credencial, senha) {
  let resposta;

  try {
    resposta = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ credencial, senha }),
    });
  } catch {
    throw new Error('Não foi possível conectar ao servidor.');
  }

  if (resposta.status === 401) {
    throw new Error('Usuário ou senha incorretos.');
  }
  if (!resposta.ok) {
    throw new Error('Erro no servidor. Tente novamente em instantes.');
  }

  return resposta.json();
}