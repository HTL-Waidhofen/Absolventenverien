const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to handle login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Log the received username and password for debugging
  console.log('Received username:', username);
  console.log('Received password:', password);

  // Create a MySQL database connection using the provided username and password
  const db = mysql.createConnection({
    host: 'localhost',
    user: username,  // The username from the login form
    password: password,  // The password from the login form
    database: 'absolventenverein',  // Your database name
  });

  // Try to connect to the database
  db.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      res.status(500).send('Failed to connect to the database');
      return;
    }

    // If the connection is successful, redirect to mitglieder.html
    console.log('Connected to the database successfully!');
    res.redirect('/Pages/mitglieder.html');
  });
});

// Serve the main HTML file for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Pages', 'login.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
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
