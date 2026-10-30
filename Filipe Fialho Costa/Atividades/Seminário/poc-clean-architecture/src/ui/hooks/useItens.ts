import { useState, useEffect } from 'react';
import { ItemEntity } from '../../domain/ItemEntity';
import { ApiItemRepository } from '../../repositories/ApiItemRepository';
import { BuscarItensUseCase } from '../../usecases/BuscarItensUseCase';

export const useItens = () => {
  const [itens, setItens] = useState<ItemEntity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const carregarItens = async () => {
      try {
        // Instanciação: Em projetos muito grandes usar-se-ia uma biblioteca de injeção de dependências
        const repositorio = new ApiItemRepository();
        const casoDeUso = new BuscarItensUseCase(repositorio);
        
        const dados = await casoDeUso.executar();
        setItens(dados);
      } catch (err) {
        setErro('Falha ao carregar os itens da API.');
      } finally {
        setLoading(false);
      }
    };

    carregarItens();
  }, []);

  return { itens, loading, erro };
};