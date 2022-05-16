// Import modules
const express = require('express'),
    morgan = require('morgan'),
    fs = require('fs'),
    path = require('path'),
    res = require('express/lib/response'),
    mongoose = require('mongoose'),
    Models = require('./models.js'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    { check, validationResult } = require('express-validator');

// Create Express app
const app = express();

// Import User and Movie models
const Users = Models.User;
const Movies = Models.Movie;

// Create a write stream in append mode . . .
// 'log.txt' is created in root dir
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {
    flags: 'a',
});

// Middleware
app.use(cors()); //cross origin resource sharing
app.use(morgan('common')); //log stuff to console
app.use(morgan('combined', { stream: accessLogStream })); //log stuff to log.txt
app.use(express.static('public')); //serve static files
app.use(bodyParser.json()); //parse headerbody
app.use(bodyParser.urlencoded({ extended: true })); //parse headerbody

// Import required for auth
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

// Connect to MongoDB
mongoose
    .connect('mongodb://localhost:27017/jackieMovieAPI', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('CONNECTION TO MONGO OPEN!!!');
    })
    .catch((err) => {
        console.log('OH NO! ERROR TRYING TO CONNECT TO MONGO!!!');
        console.log(err);
    });

// BEGINNING of - Routing endpoints
// Create new user
app.post(
    '/users/new',
    [
        check('Username', 'Username is required').isLength({ min: 5 }),
        check(
            'Username',
            'Username contains non alphanumeric characters - NOT ALLOWED.'
        ).isAlphanumeric(),
        check('Password', 'Password is required.').not().isEmpty(),
        check('Email', 'Email does not appear to be valid').isEmail(),
    ],
    (req, res) => {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        let hashedPassword = Users.hashPassword(req.body.Password);
        Users.findOne({ Username: req.body.Username })
            .then((user) => {
                if (user) {
                    return res
                        .status(400)
                        .send(req.body.Username + 'already exists');
                } else {
                    Users.create({
                        Username: req.body.Username,
                        Password: hashedPassword,
                        Email: req.body.Email,
                        Birthday: req.body.Birthday,
                    })
                        .then((user) => {
                            res.status(201).json(user);
                        })
                        .catch((error) => {
                            console.error(error);
                            res.status(500).send('Error: ' + error);
                        });
                }
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send('Error: ' + error);
            });
    }
);

// Get all users
app.get(
    '/users',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Users.find()
            .then((users) => {
                res.status(201).json(users);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error: ' + err);
            });
    }
);

// Get a user, by username
app.get(
    '/users/:Username',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Users.findOne({ Username: req.params.Username })
            .then((user) => {
                res.json(user);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error: ' + err);
            });
    }
);

// Update a user's info, by username
app.put(
    '/users/:Username/edit',
    [
        check('Username', 'Username is required').isLength({ min: 5 }),
        check(
            'Username',
            'Username contains non alphanumeric characters - NOT ALLOWED.'
        ).isAlphanumeric(),
        check('Password', 'Password is required.').not().isEmpty(),
        check('Email', 'Email does not appear to be valid').isEmail(),
    ],
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        let hashedPassword = Users.hashPassword(req.body.Password);
        Users.findOneAndUpdate(
            { Username: req.params.Username },
            {
                $set: {
                    Username: req.body.Username,
                    Password: hashedPassword,
                    Email: req.body.Email,
                    Birthday: req.body.Birthday,
                },
            },
            { new: true },
            (err, updatedUser) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Error: ' + err);
                } else {
                    res.json(updatedUser);
                }
            }
        );
    }
);

// Delete user
app.delete(
    '/users/:Username/remove',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Users.findOneAndRemove({ Username: req.params.Username })
            .then((user) => {
                if (!user) {
                    res.status(400).send(
                        req.params.Username + ' was not found'
                    );
                } else {
                    res.status(200).send(req.params.Username + ' was deleted.');
                }
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error: ' + err);
            });
    }
);

// Add fav movie
app.post(
    '/users/:Username/favorites/add/:MovieID',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Users.findOneAndUpdate(
            { Username: req.params.Username },
            {
                $push: { FavoriteMovies: req.params.MovieID },
            },
            { new: true },
            (err, updatedUser) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Error: ' + err);
                } else {
                    res.json(updatedUser);
                }
            }
        );
    }
);

// Delete fav movie
app.delete(
    '/users/:Username/favorites/remove/:MovieID',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Users.findOneAndUpdate(
            { Username: req.params.Username },
            {
                $pull: { FavoriteMovies: req.params.MovieID },
            },
            { new: true },
            (err, updatedUser) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Error: ' + err);
                } else {
                    res.json(updatedUser);
                }
            }
        );
    }
);

// Get all movies
app.get(
    '/movies',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Movies.find()
            .then((movies) => {
                res.status(201).json(movies);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error: ' + err);
            });
    }
);

// Get a movie, by title
app.get(
    '/movies/:Title',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Movies.findOne({ Title: req.params.Title })
            .then((movie) => {
                res.json(movie);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error: ' + err);
            });
    }
);

// Get info about a genre
app.get(
    '/movies/genre/:Name',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Movies.findOne({ 'Genre.Type': req.params.Type })
            .then((movie) => {
                res.json(movie.Genre.Description);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error: ' + err);
            });
    }
);

// Get info about a director
app.get(
    '/movies/directors/:Name',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Movies.findOne({ 'Director.Name': req.params.Name })
            .then((movie) => {
                res.json(movie.Director.Bio);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error: ' + err);
            });
    }
); //END of - Routing endpoints

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!!!');
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
    console.log('The Jackie Chan Movie app is listening on port ' + port);
});
