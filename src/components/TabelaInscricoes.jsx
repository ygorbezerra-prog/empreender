import React, { useState } from 'react';
import './TabelaInscricoes.css';
import { BADGE_SITUACAO, SITUACAO } from '../constants/status';

const POR_PAGINA = 25;
const DOCS_OBRIGATORIOS = ['cpf', 'doc2', 'doc3', 'doc4'];

// Helpers dos filtros dinâmicos
const valoresDaColuna = (lista, campo) => [...new Set(lista.map((i) => i[campo]))].sort();

// Funções para a busca exata (iguais as do filtro global)
const normalizarTexto = (texto) => String(texto).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const aplicarFiltros = (lista, filtros) => {
  return lista.filter((item) =>
    Object.entries(filtros).every(([campo, valor]) => {
      if (!valor) return true;
      
      // 1. Busca rigorosa em CPF e Protocolo (apenas números e tem que começar com eles)
      if (campo === 'cpf' || campo === 'protocolo') {
        const itemLimpo = String(item[campo]).replace(/\D/g, '');
        const filtroLimpo = String(valor).replace(/\D/g, '');
        return itemLimpo.startsWith(filtroLimpo);
      }
      
      // 2. Busca exata por palavra no Nome (usando \b)
      if (campo === 'nome') {
        const termoLimpo = normalizarTexto(valor).trim();
        if (!termoLimpo) return true;
        const regexBusca = new RegExp(`\\b${escapeRegExp(termoLimpo)}`);
        return regexBusca.test(normalizarTexto(item[campo]));
      }

      // 3. Para selects (Situação, Edital, etc), igualdade exata
      return String(item[campo]) === String(valor);
    })
  );
};

function Celula({ item, chave }) {
  const valor = item[chave];
  if (chave === 'nome') {
    const precisaDeAnalise = item.situacao === SITUACAO.PENDENTE;
    return (
      <span className="fw-semibold">
        {valor}
        {(item.anexo_sistema_secretaria && precisaDeAnalise) && (
          <i className="bi bi-paperclip fs-5 text-warning ms-2" title="Possui anexo no sistema antigo"></i>
        )}
      </span>
    );
  }
  if (chave === 'situacao') return <span className={`badge ${BADGE_SITUACAO[valor] ?? 'bg-secondary'}`}>{valor}</span>;
  if (chave === 'responsavel') return <span className="badge bg-white text-dark border shadow-sm">{valor}</span>;
  if (chave === 'protocolo') return <span className="fw-bold text-primary">{valor}</span>;
  return valor;
}

export default function TabelaInscricoes({ dados, colunas, usuario, onAtualizarStatus }) {
  const [pagina, setPagina] = useState(1);
  const [documentosMarcados, setDocumentosMarcados] = useState({});
  const [filtros, setFiltros] = useState({});

  if (dados.length === 0) return <div className="text-center py-4 text-muted small bg-light rounded-3">Nenhum registro encontrado.</div>;

  const dadosFiltrados = aplicarFiltros(dados, filtros);
  const visiveis = dadosFiltrados.slice(0, pagina * POR_PAGINA);
  const restantes = dadosFiltrados.length - visiveis.length;
  
  const temFiltroAtivo = Object.values(filtros).some(v => v !== '');

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
    setPagina(1);
  };

  const toggleDocumento = (inscricaoId, docKey) => {
    setDocumentosMarcados((prev) => {
      const atual = prev[inscricaoId] || {};
      return { ...prev, [inscricaoId]: { ...atual, [docKey]: !atual[docKey] } };
    });
  };

  const handleEnviarSupervisao = (id) => onAtualizarStatus && onAtualizarStatus(id, SITUACAO.AGUARDANDO_SUPERVISAO);
  const handleValidarFinal = (id) => onAtualizarStatus && onAtualizarStatus(id, SITUACAO.VALIDADO);

  const TODAS_AS_SITUACOES = Object.values(SITUACAO);

  return (
    <>
      <div className="d-flex justify-content-between align-items-end mb-2 px-1">
        <span className="small fw-semibold text-muted">
          {temFiltroAtivo 
            ? <span className="text-primary"><i className="bi bi-funnel-fill me-1"></i> Mostrando {dadosFiltrados.length} resultados filtrados</span>
            : `Total de ${dados.length} registros no bloco`}
        </span>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle tabela-inscricoes mb-0">
          <thead className="table-light">
            <tr>
              {colunas.map((c) => {
                const ehSelect = ['situacao', 'edital', 'tipoCredito', 'responsavel'].includes(c.chave);
                return (
                  <th key={c.chave} className="align-top border-bottom-0 pb-2" style={{ minWidth: ehSelect ? '160px' : '180px' }}>
                    <div className="d-flex flex-column gap-2">
                      <span className="text-nowrap text-muted fw-bold">{c.rotulo}</span>
                      {ehSelect ? (
                        <select
                          className="form-select form-select-sm fw-normal text-muted"
                          value={filtros[c.chave] || ''}
                          onChange={(e) => handleFiltroChange(c.chave, e.target.value)}
                        >
                          <option value="">Todos</option>
                          {c.chave === 'situacao' 
                            ? TODAS_AS_SITUACOES.map(v => <option key={v} value={v}>{v}</option>)
                            : valoresDaColuna(dados, c.chave).map(v => <option key={v} value={v}>{v}</option>)
                          }
                        </select>
                      ) : (
                        <input
                          type="text"
                          className="form-control form-control-sm fw-normal text-muted"
                          placeholder={`Filtrar ${c.rotulo.toLowerCase()}...`}
                          value={filtros[c.chave] || ''}
                          onChange={(e) => handleFiltroChange(c.chave, e.target.value)}
                        />
                      )}
                    </div>
                  </th>
                );
              })}
              
              <th className="text-center align-top border-bottom-0 pb-2" style={{ minWidth: '220px' }}>
                <div className="d-flex flex-column gap-2 h-100 justify-content-start">
                  <span className="text-muted fw-bold">Ações / Documentos</span>
                  {temFiltroAtivo ? (
                    <button className="btn btn-sm btn-outline-danger py-1 w-100 fw-semibold" onClick={() => { setFiltros({}); setPagina(1); }}>
                      <i className="bi bi-x-circle me-1"></i> Limpar Filtros
                    </button>
                  ) : (
                    <div style={{ height: '31px' }}></div>
                  )}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {visiveis.length === 0 ? (
              <tr><td colSpan={colunas.length + 1} className="text-center py-4 text-muted">Nenhum registro bate com os filtros nesta seção.</td></tr>
            ) : (
              visiveis.map((item) => {
                const ehEstagiario = usuario?.perfil === 'ESTAGIARIO' && item.situacao === SITUACAO.PENDENTE;
                const ehSupervisora = usuario?.perfil === 'SUPERVISOR' && item.situacao === SITUACAO.AGUARDANDO_SUPERVISAO;
                
                const docs = documentosMarcados[item.id] || {};
                const todosConferidos = DOCS_OBRIGATORIOS.every(doc => docs[doc]);

                return (
                  <tr key={item.id}>
                    {colunas.map((c) => (
                      <td key={c.chave} className={`col-${c.chave}`} title={c.chave === 'nome' ? item.nome : undefined}>
                        <Celula item={item} chave={c.chave} />
                      </td>
                    ))}
                    
                    <td className="text-center">
                      {ehEstagiario && (
                        <div className="d-flex flex-column align-items-center gap-2">
                          <div className="d-flex justify-content-center gap-1 flex-wrap">
                            <button type="button" className={`btn btn-sm rounded-pill px-2 py-1 ${docs.cpf ? 'btn-success' : 'btn-outline-secondary'}`} style={{ fontSize: '0.70rem' }} onClick={() => toggleDocumento(item.id, 'cpf')}><i className={`bi ${docs.cpf ? 'bi-check-all' : 'bi-dash'}`}></i> CPF</button>
                            <button type="button" className={`btn btn-sm rounded-pill px-2 py-1 ${docs.doc2 ? 'btn-success' : 'btn-outline-secondary'}`} style={{ fontSize: '0.70rem' }} onClick={() => toggleDocumento(item.id, 'doc2')}><i className={`bi ${docs.doc2 ? 'bi-check-all' : 'bi-dash'}`}></i> Doc 2</button>
                            <button type="button" className={`btn btn-sm rounded-pill px-2 py-1 ${docs.doc3 ? 'btn-success' : 'btn-outline-secondary'}`} style={{ fontSize: '0.70rem' }} onClick={() => toggleDocumento(item.id, 'doc3')}><i className={`bi ${docs.doc3 ? 'bi-check-all' : 'bi-dash'}`}></i> Doc 3</button>
                            <button type="button" className={`btn btn-sm rounded-pill px-2 py-1 ${docs.doc4 ? 'btn-success' : 'btn-outline-secondary'}`} style={{ fontSize: '0.70rem' }} onClick={() => toggleDocumento(item.id, 'doc4')}><i className={`bi ${docs.doc4 ? 'bi-check-all' : 'bi-dash'}`}></i> Doc 4</button>
                          </div>
                          <button className="btn btn-sm btn-primary w-100" disabled={!todosConferidos} onClick={() => handleEnviarSupervisao(item.id)}>
                            <i className="bi bi-send-check me-1"></i> {todosConferidos ? 'Enviar p/ Supervisão' : 'Faltam Documentos'}
                          </button>
                        </div>
                      )}
                      {ehSupervisora && (
                        <button className="btn btn-sm btn-success rounded-pill px-3 shadow-sm" onClick={() => handleValidarFinal(item.id)}>
                          <i className="bi bi-check-circle-fill me-1"></i> Validar Final
                        </button>
                      )}
                      {(!ehEstagiario && !ehSupervisora) && (
                        <span className="badge bg-light text-muted border px-3 py-1"><i className="bi bi-lock-fill me-1"></i> Finalizado / Bloqueado</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {restantes > 0 && (
        <div className="text-center mt-3">
          <button type="button" className="btn btn-outline-secondary btn-sm rounded-pill" onClick={() => setPagina((p) => p + 1)}>
            Mostrar mais ({restantes} restantes)
          </button>
        </div>
      )}
    </>
  );
}