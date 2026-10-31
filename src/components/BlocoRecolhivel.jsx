import React, { useState } from 'react';
import './BlocoRecolhivel.css';

export default function BlocoRecolhivel({
  titulo,
  total,
  cardClass = 'card-status-neutro',
  headerTextClass = '',
  iconClass = 'bi bi-folder2',
  abertoInicial = false,
  forcarAberto = false,
  children,
}) {
  const [aberto, setAberto] = useState(abertoInicial);
  const visivel = aberto || forcarAberto;

  return (
    <div className={`card card-status ${cardClass} bg-white mb-3 shadow-sm`}>
      <button
        type="button"
        className="bloco-cabecalho"
        onClick={() => setAberto(!aberto)}
        aria-expanded={visivel}
      >
        <span className={`fw-bold ${headerTextClass}`}>
          <i className={`${iconClass} me-2`}></i>
          {titulo} <span className="text-muted fw-normal">({total})</span>
        </span>
        <i className={`bi ${visivel ? 'bi-chevron-up' : 'bi-chevron-down'} text-muted`}></i>
      </button>

      {/* O conteúdo só existe na tela quando o bloco está aberto */}
      {visivel && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}