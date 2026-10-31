import React from 'react';
import './Rodape.css';
export default function Rodape({ onExportar }) {
  return (
    <footer className="bg-white border-top pt-4 pb-3 px-4 mt-auto">
      <div className="container-fluid">
        {onExportar && (
          <div className="d-flex justify-content-end mb-4">
            <button type="button" onClick={onExportar}
              className="btn btn-success fw-bold px-4 rounded-pill shadow-sm btn-acao">
              <i className="bi bi-file-earmark-spreadsheet me-2"></i> Exportar Planilha / CSV
            </button>
          </div>
        )}

        <div className="text-center text-muted small pt-3 border-top">
          Secretaria de Estado do Empreender Paraíba © 2026
        </div>
      </div>
    </footer>
  );
}