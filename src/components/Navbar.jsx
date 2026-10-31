import React from 'react';
import './Navbar.css';

export default function Navbar({ onSair }) {
  return (
    <header className="navbar-empreender mb-4">
      <div className="container-fluid px-4 py-3 d-flex align-items-center gap-3">
        <div className="navbar-logo">
          <i className="bi bi-ui-checks-grid"></i>
        </div>

        <div>
          <div className="navbar-orgao">Empreender Paraíba</div>
          <div className="titulo-navbar">Controle de Inscrições</div>
        </div>

        {onSair && (
          <button type="button" onClick={onSair} className="btn btn-sair ms-auto">
            <i className="bi bi-box-arrow-right me-2"></i>
            <span className="d-none d-sm-inline">Sair</span>
          </button>
        )}
      </div>

      <div className="faixa-cores"></div>
    </header>
  );
}