// Ponto de entrada: só monta a página. Nenhuma regra de negócio aqui.
import { createRoot } from 'react-dom/client';
import { ItensPage } from './ui/pages/ItensPage';

createRoot(document.getElementById('root')!).render(<ItensPage />);
