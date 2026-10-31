// Cada chave é o pedaço final da URL: /inscricoes/:tipo
export const AGRUPAMENTOS = {
  situacao:       { campo: 'situacao',    titulo: 'Situação',        singular: 'situação' },
  'tipo-credito': { campo: 'tipoCredito', titulo: 'Tipo de Crédito', singular: 'tipo de crédito' },
  edital:         { campo: 'edital',      titulo: 'Edital',          singular: 'edital' },
  municipio:      { campo: 'regiao',      titulo: 'Municípios',      singular: 'município' },
};

// Todas as colunas possíveis. O painel esconde a do campo agrupado.
export const COLUNAS = [
  { chave: 'cpf',         rotulo: 'CPF' },
  { chave: 'nome',        rotulo: 'Nome' },
  { chave: 'regiao',      rotulo: 'Cidade' },
  { chave: 'edital',      rotulo: 'Edital' },
  { chave: 'tipoCredito', rotulo: 'Tipo de Crédito' },
  { chave: 'protocolo',   rotulo: 'Protocolo' },
  { chave: 'responsavel', rotulo: 'Responsável' },
  { chave: 'situacao',    rotulo: 'Situação' },
];