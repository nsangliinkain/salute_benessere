const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (req, res) => res.render('index', { title: 'Home' }));
router.get('/consigli', (req, res) => res.render('consigli', { title: 'Consigli' }));
router.get('/bmi', (req, res) => res.render('bmi', { title: 'BMI' }));
router.get('/test', (req, res) => res.render('test', { title: 'Test' }));
router.get('/esercizi', (req, res) => res.render('esercizi', { title: 'Esercizi' }));
router.get('/signup', (req, res) => res.render('signup', { title: 'Signup' }));
router.get('/login', (req, res) => res.render('login', { title: 'Login' }));
router.get('/contatti', (req, res) => res.render('contatti', { title: 'Contatti' }));
router.get('/dashboard', (req, res) => res.render('dashboard', { title: 'Dashboard' }));
module.exports = router;