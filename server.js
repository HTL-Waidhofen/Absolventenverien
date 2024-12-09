const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const initialDb = require('./db'); 
const mysql = require('mysql2');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let db = initialDb;

/// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the login page for all routes (fallback if no other static content matches)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Pages', 'login.html'));
});

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'AV_User' && password === 'sn') {
    db = mysql.createConnection({
      host: 'localhost',
      user: 'AV_User',
      password: 'sn',
      database: 'absolventenverein'
    });

    db.connect((err) => {
      if (err) {
        res.status(500).send('Failed to connect as AV_User');
      } else {
        res.send('Logged in successfully as AV_User');
      }
    });
  } else {
    res.status(401).send('Invalid credentials');
  }
});

// CRUD operations for t_absolvent

// Create a new absolvent
app.post('/absolvent', (req, res) => {
  const { vorname, nachname, anrede, erlagscheinNr, fortlaufendeNr, verstorben, abgemeldet, akademischer_Titel, bemerkung } = req.body;
  const query = 'INSERT INTO t_absolvent (vorname, nachname, anrede, erlagscheinNr, fortlaufendeNr, verstorben, abgemeldet, akademischer_Titel, bemerkung) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [vorname, nachname, anrede, erlagscheinNr, fortlaufendeNr, verstorben, abgemeldet, akademischer_Titel, bemerkung], (err, result) => {
    if (err) throw err;
    res.send('Absolvent created successfully');
  });
});

// Read all absolventen
app.get('/absolvent', (req, res) => {
  const query = 'SELECT * FROM t_absolvent';
  db.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Update an absolvent
app.put('/absolvent/:id', (req, res) => {
  const { id } = req.params;
  const { vorname, nachname, anrede, erlagscheinNr, verstorben, abgemeldet, akademischer_Titel, bemerkung } = req.body;
  const query = 'UPDATE t_absolvent SET vorname = ?, nachname = ?, anrede = ?, erlagscheinNr = ?, verstorben = ?, abgemeldet = ?, akademischer_Titel = ?, bemerkung = ? WHERE fortlaufendeNr = ?';
  db.query(query, [vorname, nachname, anrede, erlagscheinNr, verstorben, abgemeldet, akademischer_Titel, bemerkung, id], (err, result) => {
    if (err) throw err;
    res.send('Absolvent updated successfully');
  });
});

// Delete an absolvent
app.delete('/absolvent/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM t_absolvent WHERE fortlaufendeNr = ?';
  db.query(query, [id], (err, result) => {
    if (err) throw err;
    res.send('Absolvent deleted successfully');
  });
});

// CRUD operations for t_versand

// Create a new versand
app.post('/versand', (req, res) => {
  const { FK_fortlaufendeNr, derzeitige_adresse, PLZ, urspruengliche_adresse, urspruengliche_PLZ, email, versand_post, versand_email, versand_newsletter } = req.body;
  const query = 'INSERT INTO t_versand (FK_fortlaufendeNr, derzeitige_adresse, PLZ, urspruengliche_adresse, urspruengliche_PLZ, email, versand_post, versand_email, versand_newsletter) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [FK_fortlaufendeNr, derzeitige_adresse, PLZ, urspruengliche_adresse, urspruengliche_PLZ, email, versand_post, versand_email, versand_newsletter], (err, result) => {
    if (err) throw err;
    res.send('Versand created successfully');
  });
});

// Read all versand
app.get('/versand', (req, res) => {
  const query = 'SELECT * FROM t_versand';
  db.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Update a versand
app.put('/versand/:id', (req, res) => {
  const { id } = req.params;
  const { derzeitige_adresse, PLZ, urspruengliche_adresse, urspruengliche_PLZ, email, versand_post, versand_email, versand_newsletter } = req.body;
  const query = 'UPDATE t_versand SET derzeitige_adresse = ?, PLZ = ?, urspruengliche_adresse = ?, urspruengliche_PLZ = ?, email = ?, versand_post = ?, versand_email = ?, versand_newsletter = ? WHERE FK_fortlaufendeNr = ?';
  db.query(query, [derzeitige_adresse, PLZ, urspruengliche_adresse, urspruengliche_PLZ, email, versand_post, versand_email, versand_newsletter, id], (err, result) => {
    if (err) throw err;
    res.send('Versand updated successfully');
  });
});

// Delete a versand
app.delete('/versand/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM t_versand WHERE FK_fortlaufendeNr = ?';
  db.query(query, [id], (err, result) => {
    if (err) throw err;
    res.send('Versand deleted successfully');
  });
});

// CRUD operations for t_einzahlung

// Create a new einzahlung
app.post('/einzahlung', (req, res) => {
  const { FK_fortlaufendeNr, betrag, datum } = req.body;
  const query = 'INSERT INTO t_einzahlung (FK_fortlaufendeNr, betrag, datum) VALUES (?, ?, ?)';
  db.query(query, [FK_fortlaufendeNr, betrag, datum], (err, result) => {
    if (err) throw err;
    res.send('Einzahlung created successfully');
  });
});

// Read all einzahlungen
app.get('/einzahlung', (req, res) => {
  const query = 'SELECT * FROM t_einzahlung';
  db.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Update an einzahlung
app.put('/einzahlung/:id/:datum', (req, res) => {
  const { id, datum } = req.params;
  const { betrag } = req.body;
  const query = 'UPDATE t_einzahlung SET betrag = ? WHERE FK_fortlaufendeNr = ? AND datum = ?';
  db.query(query, [betrag, id, datum], (err, result) => {
    if (err) throw err;
    res.send('Einzahlung updated successfully');
  });
});

// Delete an einzahlung
app.delete('/einzahlung/:id/:datum', (req, res) => {
  const { id, datum } = req.params;
  const query = 'DELETE FROM t_einzahlung WHERE FK_fortlaufendeNr = ? AND datum = ?';
  db.query(query, [id, datum], (err, result) => {
    if (err) throw err;
    res.send('Einzahlung deleted successfully');
  });
});

// CRUD operations for t_abschluss

// Create a new abschluss
app.post('/abschluss', (req, res) => {
  const { FK_fortlaufendeNr, abschlussklasse, abschlussjahr } = req.body;
  const query = 'INSERT INTO t_abschluss (FK_fortlaufendeNr, abschlussklasse, abschlussjahr) VALUES (?, ?, ?)';
  db.query(query, [FK_fortlaufendeNr, abschlussklasse, abschlussjahr], (err, result) => {
    if (err) throw err;
    res.send('Abschluss created successfully');
  });
});

// Read all abschluesse
app.get('/abschluss', (req, res) => {
  const query = 'SELECT * FROM t_abschluss';
  db.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Update an abschluss
app.put('/abschluss/:id/:jahr', (req, res) => {
  const { id, jahr } = req.params;
  const { abschlussklasse } = req.body;
  const query = 'UPDATE t_abschluss SET abschlussklasse = ? WHERE FK_fortlaufendeNr = ? AND abschlussjahr = ?';
  db.query(query, [abschlussklasse, id, jahr], (err, result) => {
    if (err) throw err;
    res.send('Abschluss updated successfully');
  });
});

// Delete an abschluss
app.delete('/abschluss/:id/:jahr', (req, res) => {
  const { id, jahr } = req.params;
  const query = 'DELETE FROM t_abschluss WHERE FK_fortlaufendeNr = ? AND abschlussjahr = ?';
  db.query(query, [id, jahr], (err, result) => {
    if (err) throw err;
    res.send('Abschluss deleted successfully');
  });
});

// Serve the main HTML file for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Pages/login.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});