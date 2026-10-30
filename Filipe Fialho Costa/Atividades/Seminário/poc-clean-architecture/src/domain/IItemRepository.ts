import { ItemEntity } from './ItemEntity';

export interface IItemRepository {
  buscarItens(): Promise<ItemEntity[]>;
}