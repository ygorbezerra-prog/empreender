import React, { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import './PainelAgrupado.css';
import Navbar from './components/Navbar';
import Rodape from './components/Rodape';
import BlocoRecolhivel from './components/BlocoRecolhivel';
import TabelaInscricoes from './components/TabelaInscricoes';
import { inscricoesMock } from './data/inscricoesMock';
import { STATUS_CONFIG, SITUACAO } from './constants/status';
import { AGRUPAMENTOS, COLUNAS } from './constants/agrupamentos';
import { agruparPor, normalizar } from './utils/agrupar';

function PainelAgrupado({ onSair, usuario }) {
  const { tipo } = useParams();
  const config = AGRUPAMENTOS[tipo];

  const [inscricoes, setInscricoes] = useState(inscricoesMock);
  const [busca, setBusca] = useState(''); 

  if (!config) return <Navigate to="/" replace />;

  const handleExportar = () => { };

  const handleAtualizarStatus = (id, novoStatus) => {
    setInscricoes((listaAtual) => 
      listaAtual.map((item) => 
        item.id === id ? { ...item, situacao: novoStatus } : item
      )
    );
  };

  const termo = normalizar(busca.trim());
  
  // Extrai apenas os números da busca para bater certinho com o início do CPF/Protocolo
  const termoSoNumeros = termo.replace(/\D/g, ''); 

  const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regexBusca = termo ? new RegExp(`\\b${escapeRegExp(termo)}`) : null;

  const filtradasGlobais = inscricoes.filter((i) => {
    if (usuario?.perfil === 'SUPERVISOR' && i.situacao !== SITUACAO.AGUARDANDO_SUPERVISAO) {
      return false;
    }

    if (termo) {
      // 1. Busca em texto (Nome, Município) pegando pelo início das palavras
      const matchTexto = [i.nome, i[config.campo]].some((v) => 
        regexBusca.test(normalizar(v))
      );

      // 2. Busca rigorosa em CPF e Protocolo (tem que começar estritamente com os números digitados)
      let matchNumerico = false;
      if (termoSoNumeros) {
        const cpfLimpo = String(i.cpf).replace(/\D/g, '');
        const protLimpo = String(i.protocolo).replace(/\D/g, '');
        
        matchNumerico = cpfLimpo.startsWith(termoSoNumeros) || protLimpo.startsWith(termoSoNumeros);
      }

      return matchTexto || matchNumerico;
    }
    return true;
  });

  const grupos = agruparPor(filtradasGlobais, config.campo);

  let blocos;
  if (tipo === 'situacao') {
    blocos = STATUS_CONFIG.map((s) => ({
      nome: s.situacao, titulo: s.titulo, itens: grupos[s.situacao] ?? [], visual: s,
    }));
  } else {
    blocos = Object.entries(grupos)
      .map(([nome, itens]) => ({ nome, titulo: nome, itens, visual: null }))
      .sort((a, b) => {
        if (a.nome.toLowerCase() === 'sem informação') return 1;
        if (b.nome.toLowerCase() === 'sem informação') return -1;
        return a.nome.localeCompare(b.nome, 'pt-BR', { numeric: true });
      });
  }

  blocos = blocos.filter((b) => b.itens.length > 0);
  const colunas = COLUNAS.filter((c) => c.chave !== config.campo);

  return (
    <div className="bg-light min-vh-100 d-flex flex-column justify-content-between">
      <div>
        <Navbar onSair={onSair} />
        
        <div className="container-fluid px-4">
          <Link to="/" className="btn btn-outline-secondary btn-sm rounded-pill mb-3">
            <i className="bi bi-arrow-left me-2"></i> Voltar
          </Link>

          <h3 className="fw-bold text-dark mb-4 titulo-secao">Inscrições por {config.titulo}</h3>

          <div className="bg-white p-3 rounded shadow-sm border mb-4">
            <div className="row align-items-center">
              <div className="col-md-8 col-lg-6">
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted border-end-0">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="search" 
                    className="form-control border-start-0 ps-0"
                    placeholder="Buscar protocolo, CPF ou nome em todo o sistema..."
                    value={busca} 
                    onChange={(e) => setBusca(e.target.value)}
                  />
                  {busca && (
                    <button 
                      className="btn btn-light border text-danger" 
                      onClick={() => setBusca('')}
                      title="Limpar busca"
                    >
                      <i className="bi bi-x-lg"></i>
                    </button>
                  )}
                </div>
              </div>
              {busca && (
                <div className="col-auto ms-auto">
                  <span className="badge bg-primary rounded-pill px-3 py-2 fw-normal">
                    {filtradasGlobais.length} encontrado(s)
                  </span>
                </div>
              )}
            </div>
          </div>

          {blocos.length === 0 ? (
            <div className="text-center py-5 text-muted bg-white rounded-3 shadow-sm">
              <i className="bi bi-inbox fs-1 d-block mb-3 text-secondary opacity-50"></i>
              Nenhum registro encontrado para esta busca.
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
                forcarAberto={busca !== '' && b.itens.length > 0} 
              >
                <TabelaInscricoes 
                  dados={b.itens} 
                  colunas={colunas} 
                  usuario={usuario} 
                  onAtualizarStatus={handleAtualizarStatus} 
                />
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