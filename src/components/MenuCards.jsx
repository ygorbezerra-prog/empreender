import React from 'react';
import { Link } from 'react-router-dom';
import './MenuCards.css';

export default function MenuCards() {
  const menus = [
    { id: 1, titulo: 'Situação', icone: 'bi-check-circle-fill', cor: 'secondary', rota: '/inscricoes/situacao' },
    { id: 2, titulo: 'Tipo de Crédito', icone: 'bi-people-fill', cor: 'primary', rota: '/inscricoes/tipo-credito' },
    { id: 3, titulo: 'Edital', icone: 'bi-file-earmark-text-fill', cor: 'success', rota: '/inscricoes/edital' },
    { id: 4, titulo: 'Municípios', icone: 'bi-geo-alt-fill', cor: 'info', rota: '/inscricoes/municipio' },
  ];

  return (
    <div className="container-fluid px-4 mb-4">
      <div className="menu-grid">
        {menus.map((menu) => (
          <Link
            key={menu.id}
            to={menu.rota}
            className="menu-card p-3 text-center d-flex flex-column align-items-center justify-content-center text-decoration-none"
          >
            <div className={`menu-icon-box bg-${menu.cor} bg-opacity-10 text-${menu.cor} mb-2`}>
              <i className={`bi ${menu.icone}`}></i>
            </div>
            <span className="fw-bold text-dark small">{menu.titulo}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}