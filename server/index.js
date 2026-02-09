const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

const dbPath = path.join(__dirname, 'database', 'database.sqlite');
const db = new sqlite3.Database(dbPath);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      telefone TEXT,
      data_nascimento TEXT,
      endereco TEXT,
      cidade TEXT,
      estado TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

app.get('/api/usuarios', (req, res) => {
  db.all('SELECT * FROM usuarios ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get('/api/usuarios/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM usuarios WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Usuário não encontrado' });
      return;
    }
    res.json(row);
  });
});

app.post('/api/usuarios', (req, res) => {
  const { nome, email, telefone, data_nascimento, endereco, cidade, estado } = req.body;
  
  if (!nome || !email) {
    res.status(400).json({ error: 'Nome e email são obrigatórios' });
    return;
  }

  const sql = `
    INSERT INTO usuarios (nome, email, telefone, data_nascimento, endereco, cidade, estado)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.run(sql, [nome, email, telefone, data_nascimento, endereco, cidade, estado], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        res.status(400).json({ error: 'Email já cadastrado' });
      } else {
        res.status(500).json({ error: err.message });
      }
      return;
    }
    
    res.status(201).json({
      id: this.lastID,
      nome,
      email,
      telefone,
      data_nascimento,
      endereco,
      cidade,
      estado
    });
  });
});

app.put('/api/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const { nome, email, telefone, data_nascimento, endereco, cidade, estado } = req.body;
  
  if (!nome || !email) {
    res.status(400).json({ error: 'Nome e email são obrigatórios' });
    return;
  }

  const sql = `
    UPDATE usuarios 
    SET nome = ?, email = ?, telefone = ?, data_nascimento = ?, endereco = ?, cidade = ?, estado = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  
  db.run(sql, [nome, email, telefone, data_nascimento, endereco, cidade, estado, id], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        res.status(400).json({ error: 'Email já cadastrado' });
      } else {
        res.status(500).json({ error: err.message });
      }
      return;
    }
    
    if (this.changes === 0) {
      res.status(404).json({ error: 'Usuário não encontrado' });
      return;
    }
    
    res.json({
      id: parseInt(id),
      nome,
      email,
      telefone,
      data_nascimento,
      endereco,
      cidade,
      estado
    });
  });
});

app.delete('/api/usuarios/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM usuarios WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (this.changes === 0) {
      res.status(404).json({ error: 'Usuário não encontrado' });
      return;
    }
    
    res.json({ message: 'Usuário excluído com sucesso' });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`API disponível em http://localhost:${PORT}/api`);
});
