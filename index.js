// Importing modules
const express = require('express'),
  morgan = require('morgan'),
  fs = require('fs'),
  path = require('path');
const res = require('express/lib/response');

const app = express();
// Create a write stream in append mode . . 'log.txt' is created in root dir
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})

app.use(morgan('common'));

app.listen(8080, () => {
  console.log('The Jackie Chan Movie app is listening on port 8080.');
});