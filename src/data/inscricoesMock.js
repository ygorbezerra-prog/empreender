import { SITUACAO } from '../constants/status';

// Quantas inscrições gerar. Mude à vontade (ex.: 500) para testar o desempenho.
const TOTAL = 150;

// Gerador pseudoaleatório com semente fixa: os dados são sempre os mesmos
function criarAleatorio(semente) {
  let s = semente;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const aleatorio = criarAleatorio(2026);
const sortear = (lista) => lista[Math.floor(aleatorio() * lista.length)];
const digitos = (n) =>
  Array.from({ length: n }, () => Math.floor(aleatorio() * 10)).join('');

const PRIMEIROS_NOMES = [
  'MARIA', 'JOSÉ', 'ANA', 'JOÃO', 'ANTÔNIO', 'FRANCISCA', 'CARLOS', 'LUCAS',
  'JULIANA', 'PEDRO', 'ROSANGELA', 'FERNANDA', 'PAULO', 'LUCIANA', 'MARCOS',
  'ADRIANA', 'RAIMUNDO', 'SEBASTIANA', 'EDUARDO', 'CLÁUDIA', 'YONÁ', 'ÂNGELA',
  'GABRIEL', 'LÚCIA', 'ROBERTO', 'TEREZA', 'ÉRICA', 'HELENA', 'IVAN', 'ÚRSULA',
];

const SOBRENOMES = [
  'SILVA', 'SOUSA', 'OLIVEIRA', 'SANTOS', 'PEREIRA', 'LIMA', 'FERREIRA',
  'ALVES', 'BARBOSA', 'MARTINS', 'MEIRELES', 'CARVALHO', 'GOMES', 'RIBEIRO',
  'NASCIMENTO', 'ARAÚJO', 'CAVALCANTI', 'MEDEIROS', 'FERNANDES', 'ROCHA',
  'DANTAS', 'BEZERRA', 'MOURA', 'LACERDA', 'AZEVEDO',
];

const RAMOS = ['COMERCIAL', 'CONFECÇÕES', 'PADARIA', 'ARTESANATO', 'MERCEARIA', 'AGROPECUÁRIA'];

// Cidades repetidas aparecem mais vezes: algumas ficam com mais de 25 inscrições
const CIDADES = [
  'João Pessoa', 'João Pessoa', 'João Pessoa', 'João Pessoa',
  'Campina Grande', 'Campina Grande', 'Campina Grande',
  'Patos', 'Patos', 'Sousa', 'Sousa',
  'Cajazeiras', 'Santa Rita', 'Bayeux', 'Guarabira', 'Cabedelo', 'Monteiro',
  'Pombal', 'Itaporanga', 'Areia', 'Catolé do Rocha', 'Mamanguape', 'Esperança',
  'Água Branca', 'Zabelê', 'São João do Rio do Peixe',
];

const EDITAIS = [
  { nome: 'Empreender Física', tipo: 'Pessoa Física' },
  { nome: 'Mulher Agro Física', tipo: 'Pessoa Física' },
  { nome: 'Juventude', tipo: 'Pessoa Física' },
  { nome: 'Empreender Jurídica', tipo: 'Pessoa Jurídica' },
  { nome: 'Edital 2 Microcrédito', tipo: 'Pessoa Física' },
  { nome: 'Edital 10 Microcrédito', tipo: 'Pessoa Jurídica' },
];

const RESPONSAVEIS = ['Alê', 'Ana Clara', 'Rafael', 'Beatriz'];

function sortearSituacao() {
  const n = aleatorio();
  if (n < 0.45) return SITUACAO.VALIDADO;
  if (n < 0.8) return SITUACAO.PENDENTE;
  return SITUACAO.NEGADO;
}

function gerarNome(tipo) {
  if (tipo === 'Pessoa Jurídica') {
    return `${sortear(RAMOS)} ${sortear(SOBRENOMES)} LTDA`;
  }
  const partes = [sortear(PRIMEIROS_NOMES)];
  if (aleatorio() < 0.3) partes.push(sortear(PRIMEIROS_NOMES)); // nome composto
  if (aleatorio() < 0.2) partes.push(aleatorio() < 0.5 ? 'DE' : 'DA');
  partes.push(sortear(SOBRENOMES));
  if (aleatorio() < 0.6) partes.push(sortear(SOBRENOMES));
  if (aleatorio() < 0.15) partes.push(sortear(SOBRENOMES)); // nome bem longo
  return partes.join(' ');
}

export const inscricoesMock = Array.from({ length: TOTAL }, (_, i) => {
  const edital = sortear(EDITAIS);
  return {
    id: i + 1,
    cpf: `${digitos(3)}.${digitos(3)}.${digitos(3)}-${digitos(2)}`,
    nome: gerarNome(edital.tipo),
    regiao: sortear(CIDADES),
    edital: edital.nome,
    tipoCredito: edital.tipo,
    protocolo: `${String(Math.floor(i / 1000) + 1).padStart(2, '0')}.${String(i % 1000).padStart(3, '0')}.${digitos(3)}`,
    responsavel: sortear(RESPONSAVEIS),
    situacao: sortearSituacao(),
  };
});

// Caso especial: município vazio, para testar o bloco "Sem informação"
inscricoesMock.push({
  id: TOTAL + 1,
  cpf: '000.000.000-00',
  nome: 'TESTE SEM MUNICÍPIO',
  regiao: '',
  edital: 'Juventude',
  tipoCredito: 'Pessoa Física',
  protocolo: '99.999.999',
  responsavel: 'Alê',
  situacao: SITUACAO.PENDENTE,
});