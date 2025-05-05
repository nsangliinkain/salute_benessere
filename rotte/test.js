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

  // Inizializza lo storico con i dati di registrazione
  const dataRegistrazione = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  nuovoUtente.storico = [{
    data: dataRegistrazione,
    peso: parseFloat(nuovoUtente.peso) || 0,
    sonno: parseFloat(nuovoUtente.sonno) || 0
  }];

  dati.push(nuovoUtente);
  fs.writeFileSync(datiFile, JSON.stringify(dati, null, 2));
  
  req.session.email = nuovoUtente.email;
  req.session.username = nuovoUtente.username;
  res.redirect('/dashboard');
});

router.post("/login", (req, res) => {
  const { identificatore, password } = req.body;
  
  // Validate inputs
  if (!identificatore || !password) {
    return res.status(400).json({
      success: false,
      message: "Username/email e password sono richiesti"
    });
  }

  try {
    // Read file synchronously to avoid callback issues
    const data = fs.readFileSync(datiFile, "utf8");
    const utenti = JSON.parse(data);
    
    const utente = utenti.find(
      u => (u.email === identificatore || u.username === identificatore) &&
           u.password === password
    );

    if (!utente) {
      return res.status(401).json({
        success: false,
        message: "Credenziali errate"
      });
    }

    // Store user info in session
    req.session.email = utente.email;
    req.session.username = utente.username;
    
    // Send successful response
    return res.status(200).json({
      success: true,
      message: "Login riuscito!",
      username: utente.username
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      success: false,
      message: "Errore durante il login"
    });
  }
});

router.get('/dashboard-dati', (req, res) => {
  const email = req.session?.email;
  if (!email) {
    return res.status(401).json({ errore: "Utente non autenticato" });
  }

  let dati = [];
  if (fs.existsSync(datiFile)) {
    dati = JSON.parse(fs.readFileSync(datiFile));
  }

  const utente = dati.find(u => u.email === email);
  if (!utente) {
    return res.status(404).json({ errore: "Utente non trovato" });
  }

  // Restituisci sia i dati dell'utente che lo storico
  res.json({
    utente: {
      username: utente.username,
      email: utente.email,
      eta: utente.eta,
      genere: utente.genere,
      peso: utente.peso,
      altezza: utente.altezza,
      obiettivo: utente.obiettivo,
      attivita: utente.attivita,
      sonno: utente.sonno,
      stress: utente.stress,
      allenamento: utente.allenamento
    },
    storico: utente.storico || []
  });
});

// Endpoint per aggiungere valori con data personalizzata
router.post('/aggiungi-valori', (req, res) => {
  const email = req.session?.email;
  if (!email) {
    return res.status(401).json({ errore: "Utente non autenticato" });
  }

  const { peso, sonno, data } = req.body;
  if (!peso || !sonno) {
    return res.status(400).json({ errore: "Peso e sonno sono obbligatori" });
  }

  // Usa la data fornita o la data corrente se non specificata
  const dataValori = data || new Date().toISOString().split('T')[0];

  let dati = [];
  if (fs.existsSync(datiFile)) {
    dati = JSON.parse(fs.readFileSync(datiFile));
  }

  // Trova l'utente e aggiungi i nuovi valori
  const utenteIndex = dati.findIndex(u => u.email === email);
  if (utenteIndex === -1) {
    return res.status(404).json({ errore: "Utente non trovato" });
  }

  // Inizializza l'array storico se non esiste
  if (!dati[utenteIndex].storico) {
    dati[utenteIndex].storico = [];
  }

  // Aggiungi i nuovi dati
  dati[utenteIndex].storico.push({
    data: dataValori,
    peso: parseFloat(peso),
    sonno: parseFloat(sonno)
  });

  // Ordina lo storico per data
  dati[utenteIndex].storico.sort((a, b) => new Date(a.data) - new Date(b.data));

  // Salva i dati aggiornati
  try {
    fs.writeFileSync(datiFile, JSON.stringify(dati, null, 2));
    res.json({ successo: true, messaggio: "Dati aggiunti con successo" });
  } catch (err) {
    console.error("Errore nel salvataggio dei dati:", err);
    res.status(500).json({ errore: "Errore nel salvataggio dei dati" });
  }
});

module.exports = router;