import React, { useState } from 'react';
import './Painel.css';
import Navbar from './components/Navbar';
import TabelaStatus from './components/TabelaStatus';
import Rodape from './components/Rodape';
import { inscricoesMock } from './data/inscricoesMock';
import { STATUS_CONFIG } from './constants/status';
import { Link } from 'react-router-dom';

function Painel({ onSair }) {
    const [inscricoes] = useState(inscricoesMock);

    const handleExportar = () => {
        // TODO: chamar a rota de exportação do backend
    };

    return (
        <div className="bg-light min-vh-100 d-flex flex-column justify-content-between">
            <div>
                <Navbar onSair={onSair} />
                <div className="container-fluid px-4 mb-4 d-flex align-items-center gap-3">
                    <Link to="/" className="btn btn-outline-secondary btn-sm rounded-pill">
                        <i className="bi bi-arrow-left me-2"></i> Voltar
                    </Link>
                </div>

                <div className="container-fluid px-4">
                    <div className="mb-4">
                        <h3 className="fw-bold text-dark mb-1 titulo-secao">Visão Geral por Status</h3>
                    </div>

                    {STATUS_CONFIG.map(({ situacao, titulo, cardClass, headerTextClass, iconClass }) => (
                        <TabelaStatus
                            key={situacao}
                            titulo={titulo}
                            dados={inscricoes.filter((item) => item.situacao === situacao)}
                            cardClass={cardClass}
                            headerTextClass={headerTextClass}
                            iconClass={iconClass}
                        />
                    ))}
                </div>
            </div>

            <Rodape onExportar={handleExportar} />
        </div>
    );
}

export default Painel;