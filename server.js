const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
const PORT = 3000;
const LOCALHOST = 'localhost';

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));                  

// Middleware
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

//Configurazione della sessione
app.use(session({
  secret: 'sanluSecret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Rotte
const pageRoutes = require('./rotte/pagine');
const apiRoutes = require('./rotte/api');
const testRoutes = require('./rotte/test');

app.use('/', pageRoutes);
app.use('/api', apiRoutes);
app.use('/', testRoutes);


app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ message: 'Si è verificato un errore interno' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint non trovato' });
});

app.listen(PORT, () => {
  console.log(`Server attivo su http://${LOCALHOST}:${PORT}`);
});