// src/services/ninjaService.js
import axios from 'axios';

// Cria uma instância do Axios com a URL base do back-end
const api = axios.create({
  baseURL: 'http://localhost:8080',
});

// Função para listar os ninjas
export const listarNinjas = () => {
  return api.get('/ninjas/listar');
};

// Aqui você pode adicionar outras funções que façam chamadas à API, por exemplo:
// export const criarNinja = (ninja) => {
//   return api.post('/ninjas/criar', ninja);
// };
