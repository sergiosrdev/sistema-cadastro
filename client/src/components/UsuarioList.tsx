import React, { useState, useEffect } from 'react';
import { Usuario } from '../types/Usuario';
import { usuarioService } from '../services/api';

interface UsuarioListProps {
  onEdit: (usuario: Usuario) => void;
  onRefresh: () => void;
}

const UsuarioList: React.FC<UsuarioListProps> = ({ onEdit, onRefresh }) => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      setLoading(true);
      const data = await usuarioService.listarUsuarios();
      setUsuarios(data);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar usuários:', err);
      setError('Não foi possível carregar a lista de usuários');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await usuarioService.excluirUsuario(id);
      setUsuarios(prev => prev.filter(usuario => usuario.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Erro ao excluir usuário:', err);
      setError('Não foi possível excluir o usuário');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatPhone = (phone?: string) => {
    if (!phone) return '-';
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
        <div style={{
          width: '3rem',
          height: '3rem',
          border: '4px solid #e5e7eb',
          borderTop: '4px solid #2563eb',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '0.75rem 1rem', borderRadius: '0.375rem' }}>
        {error}
        <button
          onClick={carregarUsuarios}
          style={{ marginLeft: '1rem', color: '#b91c1c', textDecoration: 'underline' }}
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (usuarios.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
        <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Nenhum usuário cadastrado</p>
        <p style={{ fontSize: '0.875rem' }}>Clique em "Novo Usuário" para começar</p>
      </div>
    );
  }

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e5e7eb' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937' }}>
          Lista de Usuários ({usuarios.length})
        </h2>
      </div>
      
      <div style={{ overflowX: 'auto' }}>
        <table className="table">
          <thead style={{ backgroundColor: '#f9fafb' }}>
            <tr>
              <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontWeight: '500', fontSize: '0.75rem', textTransform: 'uppercase', color: '#6b7280' }}>
                Nome
              </th>
              <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontWeight: '500', fontSize: '0.75rem', textTransform: 'uppercase', color: '#6b7280' }}>
                Email
              </th>
              <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontWeight: '500', fontSize: '0.75rem', textTransform: 'uppercase', color: '#6b7280' }}>
                Telefone
              </th>
              <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontWeight: '500', fontSize: '0.75rem', textTransform: 'uppercase', color: '#6b7280' }}>
                Cidade/UF
              </th>
              <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontWeight: '500', fontSize: '0.75rem', textTransform: 'uppercase', color: '#6b7280' }}>
                Cadastro
              </th>
              <th style={{ textAlign: 'right', padding: '0.75rem 1rem', fontWeight: '500', fontSize: '0.75rem', textTransform: 'uppercase', color: '#6b7280' }}>
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id} style={{ backgroundColor: usuario.id === deleteConfirm ? '#fef2f2' : 'transparent' }}>
                <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>
                    {usuario.nome}
                  </div>
                </td>
                <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap' }}>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {usuario.email}
                  </div>
                </td>
                <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap' }}>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {formatPhone(usuario.telefone)}
                  </div>
                </td>
                <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap' }}>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {usuario.cidade && usuario.estado
                      ? `${usuario.cidade}/${usuario.estado}`
                      : usuario.cidade || usuario.estado || '-'
                    }
                  </div>
                </td>
                <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap' }}>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {formatDate(usuario.created_at)}
                  </div>
                </td>
                <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap', textAlign: 'right' }}>
                  <button
                    onClick={() => onEdit(usuario)}
                    style={{ color: '#2563eb', marginRight: '0.75rem', cursor: 'pointer' }}
                  >
                    Editar
                  </button>
                  {deleteConfirm === usuario.id ? (
                    <>
                      <button
                        onClick={() => handleDelete(usuario.id!)}
                        style={{ color: '#dc2626', marginRight: '0.5rem', cursor: 'pointer' }}
                      >
                        Confirmar
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        style={{ color: '#6b7280', cursor: 'pointer' }}
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(usuario.id!)}
                      style={{ color: '#dc2626', cursor: 'pointer' }}
                    >
                      Excluir
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsuarioList;
