export const SITUACAO = {
  VALIDADO: 'VALIDADO',
  PENDENTE: 'PENDENTE DOCUMENTO',
  NEGADO: 'NEGADO',
};

export const STATUS_CONFIG = [
  {
    situacao: SITUACAO.VALIDADO,
    titulo: 'Validados',
    cardClass: 'card-status-validado',
    headerTextClass: 'text-success',
    iconClass: 'bi bi-check-circle-fill',
  },
  {
    situacao: SITUACAO.PENDENTE,
    titulo: 'Pendentes de Documento',
    cardClass: 'card-status-pendente',
    headerTextClass: 'text-warning-emphasis',
    iconClass: 'bi bi-clock-history',
  },
  {
    situacao: SITUACAO.NEGADO,
    titulo: 'Negados',
    cardClass: 'card-status-negado',
    headerTextClass: 'text-danger',
    iconClass: 'bi bi-x-circle-fill',
  },
];

// Cor do selo de situação dentro das tabelas
export const BADGE_SITUACAO = {
  [SITUACAO.VALIDADO]: 'bg-success',
  [SITUACAO.PENDENTE]: 'bg-warning text-dark',
  [SITUACAO.NEGADO]: 'bg-danger',
};