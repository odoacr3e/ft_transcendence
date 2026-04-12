const express = require('express');
const path = require('path');
const app = express();
const port = 8080;
const usersRouter = require('./client.js');

app.use('/users', usersRouter);

// Serve static files from the 'public' directory
app.use(express.static('jesus'));

// You can also specify a virtual path prefix
app.use('/static', express.static('jesus'));

// Using absolute path (recommended)
app.use('/assets', express.static(path.join(__dirname, 'jesus')));

// Respond to GET request on the root route
app.get('/', (req, res) => {
  res.send('GET to homepage');
});

// Respond to GET request on the root route
app.get('/', (req, res) => {
  res.send('GET GET GET');
});

// Respond to POST request on the root route
app.post('/', (req, res) => {
  res.send('POST request to the homepage');
});

app.get('/about/', (req, res) => {
  res.send('About page');
});

// Respond to GET request on the /about route
app.get('/about/*splat', (req, res) => {
  res.send(req.params);
});

app.get('/search', (req, res) => {
  // Access query parameters using req.query
  const {q,b} = req.query; 
  const upperQ = q.toUpperCase();
  res.send(`Search query: ${q} Category: ${b}`);
});

// Catch all other routes
app.get('/*splat', (req, res) => {
  res.status(404).send('404 - Page not found');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});