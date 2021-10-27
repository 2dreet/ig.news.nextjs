import axios from 'axios';

// aqui configura o axios para acessar a api do app
export const api = axios.create({
  baseURL: '/api'
});