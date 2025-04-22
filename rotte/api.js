const express = require('express');
const router = express.Router();
const axios = require('axios');

// Assicurati di installare axios se non l'hai già fatto:
// npm install axios --save

// Endpoint per citazioni motivazionali
router.get('/quotes', async (req, res) => {
    try {
        const response = await axios.get('https://zenquotes.io/api/random');
        res.json(response.data);
    } catch (error) {
        console.error('Errore nel recupero della citazione:', error);
        res.status(500).json({ error: 'Errore nel recupero della citazione' });
    }
});

// Endpoint per ottenere esercizi
router.get('/exercises', async (req, res) => {
    try {
        const options = {
            method: 'GET',
            url: 'https://exercisedb.p.rapidapi.com/exercises',
            headers: {
                'X-RapidAPI-Key': '80f90c4912msha01110b1e8614a6p155914jsn906c3eb1cf35', // Sostituisci con la tua chiave API
                'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
            }
        };

        const response = await axios.request(options);
        res.json(response.data);
    } catch (error) {
        console.error('Errore nel recupero degli esercizi:', error);
        res.status(500).json({ error: 'Errore nel recupero degli esercizi' });
    }
});

// Endpoint per filtrare esercizi per parte del corpo
router.get('/exercises/bodyPart/:bodyPart', async (req, res) => {
    try {
        const options = {
            method: 'GET',
            url: `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${req.params.bodyPart}`,
            headers: {
                'X-RapidAPI-Key': '80f90c4912msha01110b1e8614a6p155914jsn906c3eb1cf35', // Sostituisci con la tua chiave API
                'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
            }
        };

        const response = await axios.request(options);
        res.json(response.data);
    } catch (error) {
        console.error('Errore nel recupero degli esercizi:', error);
        res.status(500).json({ error: 'Errore nel recupero degli esercizi' });
    }
});

module.exports = router;