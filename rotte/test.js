const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const datiFile = path.join(__dirname, '..', 'database.json');

router.post('/calcola-bmi', (req, res) => {
  const { altezza, peso } = req.body;
  if (!altezza || !peso || altezza <= 0 || peso <= 0) {
    return res.status(400).json({ errore: 'Valori non validi' });
  }

  const altezzaM = altezza / 100;
  const bmi = peso / (altezzaM * altezzaM);
  let categoria = '';

  if (bmi < 18.5) categoria = 'Sottopeso';
  else if (bmi < 25) categoria = 'Normopeso';
  else if (bmi < 30) categoria = 'Sovrappeso';
  else categoria = 'Obesità';

  res.json({ bmi: bmi.toFixed(2), categoria });
});

router.post('/test-benessere', (req, res) => {
  const risposte = Object.values(req.body).map(Number);
  if (risposte.length !== 11 || risposte.some(r => r < 1 || r > 3 || isNaN(r))) {
    return res.status(400).json({ messaggio: "Dati non validi" });
  }

  const punteggio = risposte.reduce((tot, n) => tot + n, 0);
  let messaggio = "";

  if (punteggio <= 15) {
    messaggio = "⚠️ Sembra che tu stia trascurando il tuo benessere. Prova a prenderti più cura di te!";
  } else if (punteggio <= 24) {
    messaggio = "😌 Sei sulla buona strada, ma ci sono aspetti della tua salute da migliorare.";
  } else {
    messaggio = "🌟 Ottimo! Hai una buona consapevolezza del tuo benessere personale.";
  }

  res.json({ punteggio, messaggio });
});

router.post('/conferma', (req, res) => {
  res.sendFile(__dirname + '/../public/conferma.html');
});

router.post('/signup', (req, res) => {
  const nuovoUtente = req.body;

  let dati = [];
  if (fs.existsSync(datiFile)) {
    dati = JSON.parse(fs.readFileSync(datiFile));
  }

  // Controlla se l'email o username sono già usati
  const esiste = dati.find(
    u => u.email === nuovoUtente.email || u.username === nuovoUtente.username
  );
  if (esiste) {
    return res.send("Email o username già registrati.");
  }

  dati.push(nuovoUtente);
  fs.writeFileSync(datiFile, JSON.stringify(dati, null, 2));

  res.send("Registrazione completata! Ora puoi fare il login.");
});

router.post("/login", (req, res) => {
  const { identificatore, password } = req.body;

  fs.readFile(datiFile, "utf8", (err, data) => {
    if (err) return res.status(500).json({ errore: "Errore lettura file" });

    const utenti = JSON.parse(data);
    const utente = utenti.find(
      u => (u.email === identificatore || u.username === identificatore) &&
           u.password === password
    );

    if (utente) {
      res.json({
        success: true,
        message: "Login riuscito!",
        nome: utente.nome,
        username: utente.username
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Credenziali errate"
      });
    }
  });
});

module.exports = router;
