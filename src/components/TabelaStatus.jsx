import React from 'react';

export default function TabelaStatus({ titulo, dados, cardClass, headerTextClass, iconClass }) {
  return (
    <div className={`card card-status ${cardClass} bg-white mb-4 shadow-sm`}>
      <div className="card-header bg-white py-3 px-4 border-0">
        <h5 className={`fw-bold ${headerTextClass} mb-0`}>
          <i className={`${iconClass} me-2`}></i> {titulo} ({dados.length})
        </h5>
      </div>

      <div className="card-body px-4 pb-4 pt-0">
        <div className="container-excel">
          <div className="grid-excel grid-header">
            <div>CPF</div>
            <div>Nome</div>
            <div>Cidade</div>
            <div>Edital</div>
            <div>Tipo de Crédito</div>
            <div>Protocolo</div>
            <div>Responsável</div>
            <div className="text-end">Ações</div>
          </div>

          {dados.length > 0 ? (
            <div className="d-flex flex-column gap-2">
              {dados.map((item) => (
                <div key={item.id} className="card border shadow-none rounded-3 p-3 bg-light bg-opacity-50 item-card">
                  <div className="grid-excel">
                    <div className="celula-excel text-muted">{item.cpf}</div>
                    <div className="celula-excel celula-excel-bold" title={item.nome}>{item.nome}</div>
                    <div className="celula-excel">{item.regiao}</div>
                    <div className="celula-excel fw-semibold text-secondary">{item.edital}</div>
                    <div className="celula-excel">{item.tipoCredito}</div>
                    <div className="celula-excel fw-bold text-primary">{item.protocolo}</div>
                    <div className="celula-excel">
                      <span className="badge bg-white text-dark border px-2 py-1 shadow-sm">{item.responsavel}</span>
                    </div>
                    <div className="text-end">
                      <button className="btn btn-sm btn-primary rounded-pill px-3 shadow-sm btn-acao">
                        Editar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted small bg-light rounded-3">
              Nenhum registro encontrado nesta categoria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}