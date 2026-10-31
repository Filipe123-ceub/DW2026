import React from 'react';
import { useItens } from '../hooks/useItens';
import { ListaItens } from '../components/ListaItens';

export const ItensPage: React.FC = () => {
  const { itens, loading, erro } = useItens();

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Catálogo de Itens</h1>
      
      {loading && <p>A carregar dados...</p>}
      
      {erro && <p style={{ color: 'red' }}>{erro}</p>}
      
      {!loading && !erro && <ListaItens itens={itens} />}
    </div>
  );
};