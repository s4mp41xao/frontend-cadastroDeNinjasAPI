// src/services/ninjaService.js
import axios from 'axios';

// Cria uma instância do Axios com a URL base do back-end
const API_URL = 'http://localhost:8080/ninjas'

// Função para listar os ninjas
export const listarNinjas = () => {
  return axios.get(`${API_URL}/listar`)
}

export const criarNinja = ninja => axios.post(`${API_URL}/criar`, ninja)

export const deletarNinjaPorId = (id) => {
  return axios.delete(`${API_URL}/delete/${id}`);
}
// };
