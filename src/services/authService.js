// Removida a chamada real de fetch temporariamente para testar a validação de cargos
export async function login(credencial, senha) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (credencial === 'supervisora' && senha === '123') {
        resolve({
          id: 1,
          nome: 'Ana (Supervisão)',
          perfil: 'SUPERVISOR',
          token: 'token-fake-super'
        });
      } else if (credencial === 'estagiario' && senha === '123') {
        resolve({
          id: 2,
          nome: 'João (Estágio)',
          perfil: 'ESTAGIARIO',
          token: 'token-fake-estag'
        });
      } else {
        reject(new Error('Credenciais inválidas! Teste usuário "supervisora" ou "estagiario" e senha "123".'));
      }
    }, 800);
  });
}