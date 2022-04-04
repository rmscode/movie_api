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
app.use(morgan('common', {stream: accessLogStream }));

app.use(express.static('public'));

let topMovies = [
  {
    title: 'The Foreigner',
    releaseYear: '2017',
    genres: ['Action', 'Thriller'],
    stars: ['Katie Leung', 'Jackie Chan', 'Rufus Jones'],
  },
  {
    title: 'Snake in the Eagle\'s Shadow',
    releaseYear: '1978',
    genres: ['Action', 'Comedy'],
    stars: ['Jackie Chan', 'Siu-Tin Yuen', 'Jeong-Ie Hwang'],
  },
  {
    title: 'Mr. Nice Guy',
    releaseYear: '1997',
    genres: ['Action', 'Adventure', 'Comedy'],
    stars: ['Jackie Chan', 'Richard Norton', 'Miki Lee'],
  },
  {
    title: 'The Young Master',
    releaseYear: '1980',
    genres: ['Action', 'Adventure', 'Comedy'],
    stars: ['Jackie Chan', 'Tin-Chi Lau', 'King Sang Tang'],
  },
  {
    title: 'Police Story IV: First Strike',
    releaseYear: '1996',
    genres: ['Action', 'Adventure', 'Comedy'],
    stars: ['Jackie Chan', 'Jackson Lou', 'Annie Wu'],
  },
  {
    title: 'Crime Story',
    releaseYear: '1993',
    genres: ['Action', 'Crime', 'Drama'],
    stars: ['Jackie Chan', 'Kent Cheng', 'Kar-Ying Law'],
  },
  {
    title: 'Police Story 2',
    releaseYear: '1998',
    genres: ['Action', 'Comedy', 'Crime'],
    stars: ['Jackie Chan', 'Michelle Yeoh', 'Maggie Cheung'],
  },
  {
    title: 'Drunken Master',
    releaseYear: '1978',
    genres: ['Action', 'Comedy'],
    stars: ['Jackie Chan', 'Siu-Tin Yuen', 'Jeong-Iee Hwang'],
  },
  {
    title: 'Mr. Canton and Lady Rose',
    releaseYear: '1989',
    genres: ['Action', 'Comedy', 'Crime',],
    stars: ['Jackie Chan', 'Anita Mui', 'Ah-lei Gua'],
  },
  {
    title: 'Rumble in the Bronx',
    releaseYear: '1995',
    genres: ['Action', 'Comedy', 'Crime'],
    stars: ['Jackie Chan', 'Anita Mui', 'Francoise Yip'],
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