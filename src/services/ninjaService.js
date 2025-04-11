// src/services/ninjaService.js
import axios from 'axios';

// Cria uma instância do Axios com a URL base do back-end
const API_URL = 'http://localhost:8080/ninjas'

// Função para listar os ninjas
export const listarNinjas = () => {
  return axios.get(`${API_URL}/listar`)
}

// export const criarNinja = (novoNinja) => axios.post(`${API_URL}`, novoNinja)

// Aqui você pode adicionar outras funções que façam chamadas à API, por exemplo:
// export const criarNinja = (ninja) => {
//   return api.post('/ninjas/criar', ninja);
// };
