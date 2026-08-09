const express = require('express');
const db = require('./db');
const app = express();
const PORT = 3001;

app.get('/', (req, res) => {
    res.send('Hello from the contacts server!');
});

app.listen(PORT, () => {
    console.log('Server running on http://localhost:' + PORT);
});
