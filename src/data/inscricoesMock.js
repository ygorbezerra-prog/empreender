import { SITUACAO } from '../constants/status';

export const inscricoesMock = [
  {
    id: 1, cpf: '111.222.333-44', nome: 'MARCIONILA DA SILVA', regiao: 'João Pessoa',
    edital: 'Mulher Agro Física', tipoCredito: 'Pessoa Física', protocolo: '03.006.412',
    responsavel: 'Alê', situacao: SITUACAO.VALIDADO,
  },
  {
    id: 2, cpf: '555.666.777-88', nome: 'YONÁ MEIRELES', regiao: 'Sousa',
    edital: 'Empreender Física', tipoCredito: 'Pessoa Física', protocolo: '12.001.332',
    responsavel: 'Ana Clara', situacao: SITUACAO.PENDENTE,
  },
  {
    id: 3, cpf: '999.000.111-22', nome: 'JOÃO DA SILVA', regiao: 'Campina Grande',
    edital: 'Juventude', tipoCredito: 'Pessoa Física', protocolo: '99.001.111',
    responsavel: 'Alê', situacao: SITUACAO.NEGADO,
  },
];