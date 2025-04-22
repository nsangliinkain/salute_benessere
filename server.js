const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const PORT = 3000;
const LOCALHOST = 'localhost';

// Middleware
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Rotte
const pageRoutes = require('./rotte/pagine');
const apiRoutes = require('./rotte/api');
const testRoutes = require('./rotte/test');

app.use('/', pageRoutes);
app.use('/api', apiRoutes);
app.use('/', testRoutes);

app.listen(PORT, () => {
  console.log(`Server attivo su http://${LOCALHOST}:${PORT}`);
});
