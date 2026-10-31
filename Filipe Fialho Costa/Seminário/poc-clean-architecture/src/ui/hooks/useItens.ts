import { useState, useEffect } from 'react';
import { ItemEntity } from '../../domain/ItemEntity';
// 1. Alteramos a importação para o Mock
import { MockItemRepository } from '../../repositories/MockItemRepository'; 
import { BuscarItensUseCase } from '../../usecases/BuscarItensUseCase';

export const useItens = () => {
  const [itens, setItens] = useState<ItemEntity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const carregarItens = async () => {
      try {
        // 2. Injetamos o repositório falso em vez do ApiItemRepository
        const repositorio = new MockItemRepository(); 
        const casoDeUso = new BuscarItensUseCase(repositorio);
        
        const dados = await casoDeUso.executar();
        setItens(dados);
      } catch (err) {
        setErro('Falha ao carregar os itens.');
      } finally {
        setLoading(false);
      }
    };

    carregarItens();
  }, []);

  return { itens, loading, erro };
};