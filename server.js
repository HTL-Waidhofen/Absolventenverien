const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to handle login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Debugging: Log the received email and password
  console.log('Received email:', email);
  console.log('Received password:', password);

  // Implement your authentication logic here
  if (email === 'user@example.com' && password === 'password') {
    // Redirect to mitglieder.html on successful login
    res.redirect('/Pages/mitglieder.html');
    console.log('Login successful');
  } else {
    // Redirect back to login page on failure
    res.redirect('/Pages/login.html');
    console.log('Login failed');
  }
});

// Serve the main HTML file for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Pages', 'login.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});