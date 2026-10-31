import React from 'react';
import './Home.css';
import Navbar from './components/Navbar';
import MenuCards from './components/MenuCards';
import Rodape from './components/Rodape';

function Home({ onSair }) {
  return (
    <div className="bg-light min-vh-100 d-flex flex-column justify-content-between">
      <div>
        <Navbar onSair={onSair} />
        <div className="container-fluid px-4">
          <MenuCards />
        </div>
      </div>

      <Rodape />
    </div>
  );
}

export default Home;