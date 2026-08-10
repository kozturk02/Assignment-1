const Database = require('better-sqlite3');

const db = new Database('records.db');

db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    customer_name TEXT NOT NULL,

    cover_type TEXT NOT NULL
      CHECK (cover_type IN ('Single', 'Couple', 'Family')),

    applicant_1_age INTEGER NOT NULL
      CHECK (applicant_1_age BETWEEN 18 AND 100),
    applicant_1_hospital_history TEXT NOT NULL
      CHECK (applicant_1_hospital_history IN ('Yes', 'No', 'Not sure')),

    applicant_2_age INTEGER
      CHECK (applicant_2_age IS NULL OR applicant_2_age BETWEEN 18 AND 100),
    applicant_2_hospital_history TEXT
      CHECK (applicant_2_hospital_history IS NULL OR applicant_2_hospital_history IN ('Yes', 'No', 'Not sure')),

    hospital_cover_level TEXT NOT NULL
      CHECK (hospital_cover_level IN ('None', 'Basic', 'Bronze', 'Silver', 'Gold')),

    extras_cover_level TEXT NOT NULL
      CHECK (extras_cover_level IN ('None', 'Basic', 'Standard', 'Premium')),

    payment_frequency TEXT NOT NULL
      CHECK (payment_frequency IN ('Monthly', 'Yearly')),

    annual_discount_percent INTEGER
      CHECK (annual_discount_percent IS NULL OR annual_discount_percent BETWEEN 0 AND 10),

    notes TEXT,

    CHECK (
      cover_type = 'Single'
      OR (applicant_2_age IS NOT NULL AND applicant_2_hospital_history IS NOT NULL)
    )
  )
`);

module.exports = db;