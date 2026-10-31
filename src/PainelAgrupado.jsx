import React, { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import './PainelAgrupado.css';
import Navbar from './components/Navbar';
import Rodape from './components/Rodape';
import BlocoRecolhivel from './components/BlocoRecolhivel';
import TabelaInscricoes from './components/TabelaInscricoes';
import { inscricoesMock } from './data/inscricoesMock';
import { STATUS_CONFIG } from './constants/status';
import { AGRUPAMENTOS, COLUNAS } from './constants/agrupamentos';
import { agruparPor, normalizar } from './utils/agrupar';

function PainelAgrupado({ onSair }) {
  const { tipo } = useParams(); // "edital", "municipio", ...
  const config = AGRUPAMENTOS[tipo];

  const [inscricoes] = useState(inscricoesMock);
  const [busca, setBusca] = useState('');

  // Endereço inexistente (ex.: /inscricoes/abc) volta para a Home
  if (!config) return <Navigate to="/" replace />;

  const handleExportar = () => {
    // TODO: chamar a rota de exportação do backend
  };

  // 1. Filtra pela busca (nome, CPF, protocolo ou nome do grupo)
  const termo = normalizar(busca.trim());
  const filtradas = termo
    ? inscricoes.filter((i) =>
        [i.nome, i.cpf, i.protocolo, i[config.campo]].some((v) =>
          normalizar(v).includes(termo)
        )
      )
    : inscricoes;

  // 2. Agrupa pelo campo do painel
  const grupos = agruparPor(filtradas, config.campo);

  // 3. Monta a lista de blocos
  let blocos;
  if (tipo === 'situacao') {
    // Três blocos fixos, na ordem e com as cores definidas em STATUS_CONFIG
    blocos = STATUS_CONFIG.map((s) => ({
      nome: s.situacao,
      titulo: s.titulo,
      itens: grupos[s.situacao] ?? [],
      visual: s,
    }));
  } else {
    // Blocos que nascem dos dados, sempre em ordem alfabética
    blocos = Object.entries(grupos)
      .map(([nome, itens]) => ({ nome, titulo: nome, itens, visual: null }))
      .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR', { numeric: true }));
  }

  // 4. A coluna do campo agrupado é redundante dentro do bloco
  const colunas = COLUNAS.filter((c) => c.chave !== config.campo);

  return (
    <div className="bg-light min-vh-100 d-flex flex-column justify-content-between">
      <div>
        <Navbar onSair={onSair} />

        <div className="container-fluid px-4">
          <Link to="/" className="btn btn-outline-secondary btn-sm rounded-pill mb-3">
            <i className="bi bi-arrow-left me-2"></i> Voltar
          </Link>

          <h3 className="fw-bold text-dark mb-3 titulo-secao">
            Inscrições por {config.titulo}
          </h3>

          <div className="mb-4">
            <div className="input-group campo-busca">
              <span className="input-group-text bg-white">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="search"
                className="form-control"
                placeholder={`Buscar por nome, CPF, protocolo ou ${config.singular}`}
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                aria-label="Buscar inscrições"
              />
            </div>
          </div>

          {blocos.length === 0 ? (
            <div className="text-center py-5 text-muted bg-white rounded-3 shadow-sm">
              Nada encontrado para "{busca}".
            </div>
          ) : (
            blocos.map((b) => (
              <BlocoRecolhivel
                key={b.nome}
                titulo={b.titulo}
                total={b.itens.length}
                cardClass={b.visual?.cardClass}
                headerTextClass={b.visual?.headerTextClass}
                iconClass={b.visual?.iconClass}
                abertoInicial={false}
                forcarAberto={termo !== '' && b.itens.length > 0}
              >
                <TabelaInscricoes dados={b.itens} colunas={colunas} />
              </BlocoRecolhivel>
            ))
          )}
        </div>
      </div>

      <Rodape onExportar={handleExportar} />
    </div>
  );
}

export default PainelAgrupado;