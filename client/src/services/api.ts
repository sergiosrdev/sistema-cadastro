import axios from 'axios';
import { Usuario } from '../types/Usuario';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const usuarioService = {
  async listarUsuarios(): Promise<Usuario[]> {
    const response = await api.get('/usuarios');
    return response.data;
  },

  async buscarUsuario(id: number): Promise<Usuario> {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  },

  async criarUsuario(usuario: Omit<Usuario, 'id'>): Promise<Usuario> {
    const response = await api.post('/usuarios', usuario);
    return response.data;
  },

  async atualizarUsuario(id: number, usuario: Omit<Usuario, 'id'>): Promise<Usuario> {
    const response = await api.put(`/usuarios/${id}`, usuario);
    return response.data;
  },

  async excluirUsuario(id: number): Promise<void> {
    await api.delete(`/usuarios/${id}`);
  },
};
