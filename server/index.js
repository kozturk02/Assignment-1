const express = require('express');
const db = require('./db');
const app = express();
const PORT = 3001;

app.use(express.json());

app.post('/contacts', (req, res) => {
    const { name, email, phone } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    const stmt = db.prepare('INSERT INTO contacts (name, email, phone) VALUES (?, ?, ?)');
    const info = stmt.run(name, email, phone);

    res.status(201).json({ id: info.lastInsertRowid, name, email, phone});
});

// READ all contacts
app.get('/contacts', (req, res) => {
    const contacts = db.prepare('SELECT * FROM contacts').all();
    res.json(contacts);
});

// READ single contact
app.get('/contacts/:id', (req, res) => {
    const contact = db.prepare('SELECT * FROM contacts WHERE id = ?').get(req.params.id);

    if (!contact) {
        return res.status(404).json({ error: 'Contact not found' });
    }

    res.json(contact);
});

// UPDATE
app.put('/contacts/:id', (req, res) => {
  const { name, email, phone } = req.body;

  const stmt = db.prepare('UPDATE contacts SET name = ?, email = ?, phone = ? WHERE id = ?');
  const result = stmt.run(name, email, phone, req.params.id);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Contact not found' });
  }

  res.json({ id: Number(req.params.id), name, email, phone });
});

// DELETE
app.delete('/contacts/:id', (req, res) => {
  const stmt = db.prepare('DELETE FROM contacts WHERE id = ?');
  const result = stmt.run(req.params.id);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Contact not found' });
  }

  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});