// Transforma uma lista em { "Sousa": [...], "Patos": [...] } por qualquer campo
export function agruparPor(lista, campo) {
  const grupos = {};
  for (const item of lista) {
    const chave = item[campo] || 'Sem informação';
    (grupos[chave] ??= []).push(item);
  }
  return grupos;
}

// Para a busca ignorar maiúsculas e acentos
export function normalizar(texto) {
  return String(texto ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}