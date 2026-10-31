import { ItemEntity } from '../domain/ItemEntity';
import { IItemRepository } from '../domain/IItemRepository';

export class MockItemRepository implements IItemRepository {
  async buscarItens(): Promise<ItemEntity[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: '1', nome: 'Arquitetura Limpa', preco: 100.0 },
          { id: '2', nome: 'Desacoplamento', preco: 250.5 },
          { id: '3', nome: 'Microsserviços BFF', preco: 99.9 }
        ]);
      }, 500); 
    });
  }
}