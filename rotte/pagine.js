const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (req, res) => res.sendFile(path.join(process.cwd(), 'public', 'index.html')));
router.get('/consigli', (req, res) => res.sendFile(path.join(process.cwd(), 'public', 'consigli.html')));
router.get('/bmi', (req, res) => res.sendFile(path.join(process.cwd(), 'public', 'bmi.html')));
router.get('/test', (req, res) => res.sendFile(path.join(process.cwd(), 'public', 'test.html')));
router.get('/contatti', (req, res) => res.sendFile(path.join(process.cwd(), 'public', 'contatti.html')));
router.get('/esercizi', (req, res) => res.sendFile(path.join(process.cwd(), 'public', 'esercizi.html')));
router.get('/signup', (req, res) => res.sendFile(path.join(process.cwd(), 'public', 'signup.html')));
router.get('/login', (req, res) => res.sendFile(path.join(process.cwd(), 'public', 'login.html')));
module.exports = router;