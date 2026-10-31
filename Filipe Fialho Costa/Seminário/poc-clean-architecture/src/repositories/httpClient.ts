export const httpClient = {
  get: async <T>(url: string): Promise<T> => {
    // Simula a chamada a uma API ou BFF
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }
    return response.json();
  }
};