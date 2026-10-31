import React, { useState } from 'react';
import './TabelaInscricoes.css';
import { BADGE_SITUACAO } from '../constants/status';

const POR_PAGINA = 25;

function Celula({ item, chave }) {
  const valor = item[chave];

  if (chave === 'situacao') {
    return <span className={`badge ${BADGE_SITUACAO[valor] ?? 'bg-secondary'}`}>{valor}</span>;
  }
  if (chave === 'responsavel') {
    return <span className="badge bg-white text-dark border">{valor}</span>;
  }
  if (chave === 'protocolo') {
    return <span className="fw-bold text-primary">{valor}</span>;
  }
  return valor;
}

export default function TabelaInscricoes({ dados, colunas }) {
  const [pagina, setPagina] = useState(1);

  if (dados.length === 0) {
    return (
      <div className="text-center py-4 text-muted small bg-light rounded-3">
        Nenhum registro encontrado.
      </div>
    );
  }

  const visiveis = dados.slice(0, pagina * POR_PAGINA);
  const restantes = dados.length - visiveis.length;

  return (
    <>
      <div className="table-responsive">
        <table className="table table-hover align-middle tabela-inscricoes mb-0">
          <thead>
            <tr>
              {colunas.map((c) => (
                <th key={c.chave}>{c.rotulo}</th>
              ))}
              <th className="text-end">Ações</th>
            </tr>
          </thead>
          <tbody>
            {visiveis.map((item) => (
              <tr key={item.id}>
                {colunas.map((c) => (
                  <td
                    key={c.chave}
                    className={`col-${c.chave}`}
                    title={c.chave === 'nome' ? item.nome : undefined}
                  >
                    <Celula item={item} chave={c.chave} />
                  </td>
                ))}
                <td className="text-end">
                  <button type="button" className="btn btn-sm btn-primary rounded-pill px-3">
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {restantes > 0 && (
        <div className="text-center mt-3">
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm rounded-pill"
            onClick={() => setPagina((p) => p + 1)}
          >
            Mostrar mais ({restantes} restantes)
          </button>
        </div>
      )}
    </>
  );
}