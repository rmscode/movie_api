// Importing modules
const express = require('express'),
  morgan = require('morgan'),
  fs = require('fs'),
  path = require('path');
  res = require('express/lib/response');
  app = express();
  // Create a write stream in append mode . . 'log.txt' is created in root dir
  accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})

// Morgan will log requests
app.use(morgan('common'));

app.use(express.static('public'));

let topMovies = [
  {
    title: 'The Foreigner',
    releaseYear: '2017',
    genres: [],
    stars: [],
  },
  {
    title: 'Snake in the Eagle\'s Shadow',
    releaseYear: '1978',
    genres: [],
    stars: [],
  },
  {
    title: 'Mr. Nice Guy',
    releaseYear: '1997',
    genres: [],
    stars: [],
  },
  {
    title: 'The Young Master',
    releaseYear: '1980',
    genres: [],
    stars: [],
  },
  {
    title: 'Police Story IV: First Strike',
    releaseYear: '1996',
    genres: [],
    stars: [],
  },
  {
    title: 'Crime Story',
    releaseYear: '1993',
    genres: [],
    stars: [],
  },
  {
    title: 'Police Story 2',
    releaseYear: '1998',
    genres: [],
    stars: [],
  },
  {
    title: 'Drunken Master',
    releaseYear: '1978',
    genres: [],
    stars: [],
  },
  {
    title: 'Mr. Canton and Lady Rose',
    releaseYear: '1989',
    genres: [],
    stars: [],
  },
  {
    title: 'Rumble in the Bronx',
    releaseYear: '1995',
    genres: [],
    stars: [],
  },
];

// Routing GET requests
app.get('/', (req, res) => {
  res.send(`<h1>Welcome to the homepage!!!!</h1>`)
});

// app.get('/documentation', (req, res) => {
//   res.sendFile('public/documentation.html', { root: __dirname })
// });

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!!!');
});

app.listen(8080, () => {
  console.log('The Jackie Chan Movie app is listening on port 8080.');
});