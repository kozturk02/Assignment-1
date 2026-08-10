const express = require('express');
const cors = require('cors');
const db = require('./db');
const app = express();
const PORT = 3001;
const NOT_FOUND = 'Record not found';

app.use(cors());
app.use(express.json());

// CREATE
app.post('/records', (req, res) => {
  const {
    customer_name,
    cover_type,
    applicant_1_age,
    applicant_1_hospital_history,
    applicant_2_age,
    applicant_2_hospital_history,
    hospital_cover_level,
    extras_cover_level,
    payment_frequency,
    annual_discount_percent,
    notes,
  } = req.body;

  try {
    const stmt = db.prepare(`
      INSERT INTO records (
        customer_name, cover_type,
        applicant_1_age, applicant_1_hospital_history,
        applicant_2_age, applicant_2_hospital_history,
        hospital_cover_level, extras_cover_level,
        payment_frequency, annual_discount_percent, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      customer_name,
      cover_type,
      applicant_1_age,
      applicant_1_hospital_history,
      applicant_2_age ?? null,
      applicant_2_hospital_history ?? null,
      hospital_cover_level,
      extras_cover_level,
      payment_frequency,
      annual_discount_percent ?? null,
      notes ?? null
    );

    const newApp = db
      .prepare('SELECT * FROM records WHERE id = ?')
      .get(result.lastInsertRowid);

    res.status(201).json(newApp);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ all
app.get('/records', (req, res) => {
  const apps = db.prepare('SELECT * FROM records').all();
  res.json(apps);
});

// READ one
app.get('/records/:id', (req, res) => {
  const app_ = db
    .prepare('SELECT * FROM records WHERE id = ?')
    .get(req.params.id);

  if (!app_) {
    return res.status(404).json({ error: NOT_FOUND });
  }

  res.json(app_);
});

// UPDATE
app.put('/records/:id', (req, res) => {
  const {
    customer_name,
    cover_type,
    applicant_1_age,
    applicant_1_hospital_history,
    applicant_2_age,
    applicant_2_hospital_history,
    hospital_cover_level,
    extras_cover_level,
    payment_frequency,
    annual_discount_percent,
    notes,
  } = req.body;

  try {
    const stmt = db.prepare(`
      UPDATE records SET
        customer_name = ?, cover_type = ?,
        applicant_1_age = ?, applicant_1_hospital_history = ?,
        applicant_2_age = ?, applicant_2_hospital_history = ?,
        hospital_cover_level = ?, extras_cover_level = ?,
        payment_frequency = ?, annual_discount_percent = ?, notes = ?
      WHERE id = ?
    `);

    const result = stmt.run(
      customer_name,
      cover_type,
      applicant_1_age,
      applicant_1_hospital_history,
      applicant_2_age ?? null,
      applicant_2_hospital_history ?? null,
      hospital_cover_level,
      extras_cover_level,
      payment_frequency,
      annual_discount_percent ?? null,
      notes ?? null,
      req.params.id
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: NOT_FOUND });
    }

    const updated = db
      .prepare('SELECT * FROM records WHERE id = ?')
      .get(req.params.id);

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE
app.delete('/records/:id', (req, res) => {
  const stmt = db.prepare('DELETE FROM records WHERE id = ?');
  const result = stmt.run(req.params.id);

  if (result.changes === 0) {
    return res.status(404).json({ error: NOT_FOUND });
  }

  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});