import { api } from './api';

// Nomes idênticos ao record do Java!
export interface DashboardSummary {
  totalIncome: number;  
  totalExpense: number; 
  balance: number;       
}

export async function getSummary(startDate: string, endDate: string): Promise<DashboardSummary> {
  const response = await api.get('/api/v1/transactions/summary', {
    params: {
      startDate,
      endDate
    }
  });
  return response.data;
}

// Adicione à interface existente ou crie uma nova para o Response da Transação
export interface TransactionResponse {
  id: string;
  description: string;
  amount: number;
  transactionDate: string;
  category: {
    name: string;
  };
}

// Interface para o retorno paginado do Spring
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  size: number;
  number: number;
}

export async function findAllTransactions(page = 0, size = 10): Promise<PaginatedResponse<TransactionResponse>> {
  const response = await api.get('/api/v1/transactions', {
    params: { page, size }
  });
  return response.data;
}