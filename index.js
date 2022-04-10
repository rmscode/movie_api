// Importing modules
const express = require('express'),
	morgan = require('morgan'),
	fs = require('fs'),
	path = require('path');
	res = require('express/lib/response');
	app = express();
    bodyParser = require('body-parser');
    uuid = require('uuid');
	// Create a write stream in append mode . . 'log.txt' is created in root dir
	accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})

app.use(bodyParser.json());

// Morgan will log requests
app.use(morgan('common', {stream: accessLogStream }));

// Serving static html files
app.use(express.static('public'));

let users = [
    {
        id: 1,
        name: "Ricky",
        favoriteMovies: ["Rumble in the Bronx"]
    },
    {
        id: 2,
        name: "Sam",
        favoriteMovies: []
    },
]

let movies = [
	{
		Title: 'The Foreigner',
        Description: 'Quan is a humble London businessman whose long-buried past erupts in a revenge-fueled vendetta when the only person left for him to love – his teenage daughter – dies in an Irish Republican Army car bombing. His relentless search to find the terrorists leads to a cat-and-mouse conflict with a British government official whose own past may hold the clues to the identities of the elusive killers.',
        Director: {
            Name: 'Martin Campbell',
            DOB: '10-24-1943',
        },
		Genre:
            {
                Name: 'Action',
                Description: 'Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats',
            },
		ReleaseDate: '09-28-2017',
		Stars: ['Katie Leung', 'Jackie Chan', 'Rufus Jones'],
	},
	{
		Title: 'Snake in the Eagle\'s Shadow',
        Description: 'Everyone abuses and humiliates a downtrodden orphan (Chan) until he befriends an old man, who turns out to be the last master of the "snake fist" fighting style. Jackie becomes the old man\'s student and finds himself in battle with the master of the "eagle\'s claw" style, who has vowed to destroy the snake fist clan.',
        Director: {
            Name: 'Yuen Woo-ping',
            DOB: '01-01-1945',
        },
		Genre:
            {
                Name: 'Comedy',
                Description: 'A comedy film is a category of film which emphasizes humor. These films are designed to make the audience laugh through amusement.',
            },
		ReleaseDate: '11/05/1978',
		Stars: ['Jackie Chan', 'Siu-Tin Yuen', 'Jeong-Ie Hwang'],
	},
	{
		Title: 'Mr. Nice Guy',
        Description: 'A Chinese chef accidentally gets involved with a news reporter who filmed a drug bust that went awry and is now being chased by gangs who are trying to get the video tape.',
        Director: {
            Name: 'Sammo Hung',
            DOB: '01-07-1952',
        },
		Genre:
            {
                Name: 'Crime',
                Description: 'Crime films, in the broadest sense, is a film genre inspired by and analogous to the crime fiction literary genre. Films of this genre generally involve various aspects of crime and its detection.',
            },
		ReleaseDate: '03-18-1998',
		Stars: ['Jackie Chan', 'Richard Norton', 'Miki Lee'],
	},
	{
		Title: 'The Young Master',
        Description: '',
        Director: {
            Name: '',
            DOB: '',
        },
		Genre:
            {
                Name: '',
                Description: '',
            },
		ReleaseDate: '1980',
		Stars: ['Jackie Chan', 'Tin-Chi Lau', 'King Sang Tang'],
	},
	{
		Title: 'Police Story IV: First Strike',
        Description: '',
        Director: {
            Name: '',
            DOB: '',
        },
		Genre:
            {
                Name: '',
                Description: '',
            },
		ReleaseDate: '1996',
		Stars: ['Jackie Chan', 'Jackson Lou', 'Annie Wu'],
	},
	{
		Title: 'Crime Story',
        Description: '',
        Director: {
            Name: '',
            DOB: '',
        },
		Genre:
            {
                Name: '',
                Description: '',
            },
		ReleaseDate: '1993',
		Stars: ['Jackie Chan', 'Kent Cheng', 'Kar-Ying Law'],
	},
	{
		Title: 'Police Story 2',
        Description: '',
        Director: {
            Name: '',
            DOB: '',
        },
		Genre:
            {
                Name: '',
                Description: '',
            },
		ReleaseDate: '1998',
		Stars: ['Jackie Chan', 'Michelle Yeoh', 'Maggie Cheung'],
	},
	{
		Title: 'Drunken Master',
        Description: '',
        Director: {
            Name: '',
            DOB: '',
        },
		Genre:
            {
                Name: '',
                Description: '',
            },
		ReleaseDate: '1978',
		Stars: ['Jackie Chan', 'Siu-Tin Yuen', 'Jeong-Iee Hwang'],
	},
	{
		Title: 'Mr. Canton and Lady Rose',
        Description: '',
        Director: {
            Name: '',
            DOB: '',
        },
		Genre:
            {
                Name: '',
                Description: '',
            },
		ReleaseDate: '1989',
		Stars: ['Jackie Chan', 'Anita Mui', 'Ah-lei Gua'],
	},
	{
		Title: 'Rumble in the Bronx',
        Description: 'Keong comes from Hong Kong to visit New York for his uncle\'s wedding. His uncle runs a market in the Bronx and Keong offers to help out while Uncle is on his honeymoon. During his stay in the Bronx, Keong befriends a neighbor kid and beats up some neighborhood thugs who cause problems at the market. One of those petty thugs in the local gang stumbles into a criminal situation way over his head.',
        Director: {
            Name: 'Stanley Tong',
            DOB: '04-07-1960',
        },
		Genre: [
            {
                Name: 'Crime',
                Description: 'Crime films, in the broadest sense, is a film genre inspired by and analogous to the crime fiction literary genre. Films of this genre generally involve various aspects of crime and its detection.',
            },
        ],
		ReleaseDate: '02-26-1996',
		Stars: ['Jackie Chan', 'Anita Mui', 'Francoise Yip'],
	},
];

// BEGINNING of - Routing endpoints
// Create new user
app.post('/users/new', (req, res) => {
    const newUser = req.body;

    if (newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser)
    } else {
        res.status(400).send('users need names')
    }
})

// Edit user
app.put('/users/:id/edit', (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;

    let user = users.find( user => user.id == id );

    if (user) {
        user.name = updatedUser.name;
        res.status(200).json(user);
    } else {
        res.status(400).send('no such user')
    }
})

// Add fav movie
app.post('/users/:id/favorites/add/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find( user => user.id == id );

    if (user) {
        user.favoriteMovies.push(movieTitle);
        res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
    } else {
        res.status(400).send('no such user')
    }
})

// Delete fav movie
app.delete('/users/:id/favorites/remove/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find( user => user.id == id );

    if (user) {
        user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
        res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);
    } else {
        res.status(400).send('no such user')
    }
})

// Remove user profile
app.delete('/users/:id/remove', (req, res) => {
    const { id } = req.params;

    let user = users.find( user => user.id == id );

    if (user) {
        users = users.filter( user => user.id != id);
        res.status(200).send(`user ${id} has been deleted`);
    } else {
        res.status(400).send('no such user')
    }
})

// Show movies
app.get('/movies', (req, res) => {
	res.json(movies);
})

// Show specific title
app.get('/movies/:title', (req, res) => {
	const { title } = req.params;
    const movie = movies.find( movie => movie.Title === title );

        if (movie) {
            res.status(200).json(movie);
        } else {
            res.status(400).send('no such movie')
        }
})

// Show info about genre
app.get('/movies/genre/:genreName', (req, res) => {
	const { genreName } = req.params;
    const genre = movies.find( movie => movie.Genre.Name === genreName ).Genre;

        if (genre) {
            res.status(200).json(genre);
        } else {
            res.status(400).send('no such genre')
        }
})

// Show info about director
app.get('/movies/directors/:directorName', (req, res) => {
	const { directorName } = req.params;
    const director = movies.find( movie => movie.Director.Name === directorName ).Director;

        if (director) {
            res.status(200).json(director);
        } else {
            res.status(400).send('no such director')
        }
}) //END of - Routing endpoints

// Error handling
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send('Something went wrong!!!');
});

app.listen(8080, () => {
	console.log('The Jackie Chan Movie app is listening on port 8080.');
});