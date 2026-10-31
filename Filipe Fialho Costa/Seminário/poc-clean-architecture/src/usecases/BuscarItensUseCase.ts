import { IItemRepository } from '../domain/IItemRepository';
import { ItemEntity } from '../domain/ItemEntity';

export class BuscarItensUseCase {
  // A dependência é injetada através do construtor
  constructor(private itemRepository: IItemRepository) {}

  async executar(): Promise<ItemEntity[]> {
    // É aqui que entrariam as regras de negócio centrais, 
    // como validar dados ou filtrar itens específicos antes de entregar à UI.
    const itens = await this.itemRepository.buscarItens();
    return itens;
  }
}