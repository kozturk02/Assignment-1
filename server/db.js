const Database = require('better-sqlite3');

const db = new Database('contacts.db');

db.exec('CREATE TABLE IF NOT EXISTS contacts (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT, phone TEXT)');

module.exports = db;
