import { IItemRepository } from '../domain/IItemRepository';
import { ItemEntity } from '../domain/ItemEntity';
import { httpClient } from './httpClient';

export class ApiItemRepository implements IItemRepository {
  async buscarItens(): Promise<ItemEntity[]> {
    // Chama o BFF da parte 3 (pasta ../poc-bff). Ele busca os produtos no
    // microsserviço e já devolve no formato ItemEntity: esta camada não
    // precisa saber que existem microsserviços nem converter centavos.
    const url = 'http://localhost:4000/api/itens';

    const dados = await httpClient.get<ItemEntity[]>(url);
    return dados;
  }
}