import React from 'react';
import { ItemEntity } from '../../domain/ItemEntity';

interface ListaItensProps {
  itens: ItemEntity[];
}

export const ListaItens: React.FC<ListaItensProps> = ({ itens }) => {
  if (itens.length === 0) {
    return <p>Nenhum item encontrado no catálogo.</p>;
  }

  return (
    <ul>
      {itens.map((item) => (
        <li key={item.id}>
          <strong>{item.nome}</strong> - {item.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          {item.descricao && <em> ({item.descricao})</em>}
        </li>
      ))}
    </ul>
  );
};