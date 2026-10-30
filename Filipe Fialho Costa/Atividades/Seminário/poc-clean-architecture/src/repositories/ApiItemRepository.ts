import { IItemRepository } from '../domain/IItemRepository';
import { ItemEntity } from '../domain/ItemEntity';
import { httpClient } from './httpClient';

export class ApiItemRepository implements IItemRepository {
  async buscarItens(): Promise<ItemEntity[]> {
    // Na demonstração prática, isto chamaria o URL do seu BFF ou API
    // Usamos um endpoint fictício ou local para o exemplo
    const url = 'https://api.exemplo.com/itens'; 
    
    // Na prova de conceito (PoC), se a API não existir, pode simular o retorno com um mock estático aqui
    const dados = await httpClient.get<ItemEntity[]>(url);
    return dados;
  }
}