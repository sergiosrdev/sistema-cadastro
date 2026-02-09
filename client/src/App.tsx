import React, { useState } from 'react';
import { Usuario } from './types/Usuario';
import UsuarioForm from './components/UsuarioForm';
import UsuarioList from './components/UsuarioList';

function App() {
  const [showForm, setShowForm] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState<Usuario | undefined>();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleNewUsuario = () => {
    setEditingUsuario(undefined);
    setShowForm(true);
  };

  const handleEditUsuario = (usuario: Usuario) => {
    setEditingUsuario(usuario);
    setShowForm(true);
  };

  const handleSaveUsuario = () => {
    setShowForm(false);
    setEditingUsuario(undefined);
    setRefreshKey(prev => prev + 1);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingUsuario(undefined);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      <header style={{ backgroundColor: '#2563eb', color: 'white', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 0' }}>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>Sistema de Cadastro</h1>
            {!showForm && (
              <button
                onClick={handleNewUsuario}
                style={{ backgroundColor: 'white', color: '#2563eb', padding: '0.5rem 1rem', borderRadius: '0.375rem', fontWeight: '500', cursor: 'pointer' }}
              >
                Novo Usuário
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="container" style={{ padding: '2rem 0' }}>
        {showForm ? (
          <div style={{ marginBottom: '2rem' }}>
            <UsuarioForm
              usuario={editingUsuario}
              onSave={handleSaveUsuario}
              onCancel={handleCancelForm}
            />
          </div>
        ) : (
          <UsuarioList
            key={refreshKey}
            onEdit={handleEditUsuario}
            onRefresh={() => setRefreshKey(prev => prev + 1)}
          />
        )}
      </main>
    </div>
  );
}

export default App;
