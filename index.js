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

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!!!');
});

app.listen(8080, () => {
  console.log('The Jackie Chan Movie app is listening on port 8080.');
});