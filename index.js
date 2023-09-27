const express = require('express');
const app = express();
const morgan = require('morgan');
const uuid = require('uuid');

app.use(morgan('combined'));

let movies =[
  {
    "title": "The Godfather",
    "director": "Francis Ford Coppola",
    "year": 1972,
    "genre": "Crime",
    "movieId": 1
  },
  {
    "title": "Step Brothers",
    "director": "Adam McKay",
    "year": 2008,
    "genre": "Comedy",
    "movieId": 2
  },
  {
    "title": "Free Guy",
    "director": "Shawn Levy",
    "year": 2021,
    "genre": "Comedy/Action",
    "movieId": 3
  },
  {
    "title": "National Lampoon's Christmas Vacation",
    "director": "Jeremiah S. Chechik",
    "year": 1989,
    "genre": "Comedy",
    "movieId": 4
  },
  {
    "title": "The Wolf of Wall Street",
    "director": "Martin Scorsese",
    "year": 2013,
    "genre": "Comedy/Crime",
    "movieId": 5
  },
  {
    "title": "The Big Short",
    "director": "Adam McKay",
    "year": 2015,
    "genre": "Comedy/Drama",
    "movieId": 6
  },
  {
    "title": "Bullet Train",
    "director": "David Leitch",
    "year": 2022,
    "genre": "Comedy/Action",
    "movieId": 7
  },
  {
    "title": "Deadpool 2",
    "director": "David Leitch",
    "year": 2018,
    "genre": "Comedy/Action",
    "movieId": 8
  },
  {
    "title": "Spirited",
    "director": "Sean Anders",
    "year": 2022,
    "genre": "Comedy/Holiday",
    "movieId": 9
  },
  {
    "title": "R.I.P.D.",
    "director": "Robert Schwentke",
    "year": 2013,
    "genre": "Comedy",
    "movieId": 10
  },
]

let directors = [
  {
    name: "Francis Ford Coppola",
    bio: "Director of The Godfather",
    birthYear: 1939,
    deathYear: null, 
  },
  {
    name: "Adam McKay",
    bio: "Director of Step Brothers and The Big Short",
    birthYear: 1968,
    deathYear: null
  },
  {
    name: "Shawn Levy",
    bio: "Director of Free Guy",
    birthYear: 1968,
    deathYear: null
  },
  {
    name: "Jeremiah S. Chechik",
    bio: "Director of National Lampoon's Christmas Vacation",
    birthYear: 1955,
    deathYear: null
  },
  {
    name: "Martin Scorsese",
    bio: "Director of The Wolf of Wall Street",
    birthYear: 1942,
    deathYear: null
  },
  {
    name: "David Leitch",
    bio: "Director of Deadpool 2 and Bullet Train",
    birthYear: 1975,
    deathYear: null
  },
  {
    name: "Sean Anders",
    bio: "Director of Spirited",
    birthYear: 1969,
    deathYear: null
  },
  {
    name: "Robert Schwentke",
    bio: "Director of R.I.P.D.",
    birthYear: 1968,
    deathYear: null
  }
];


// Example user array
let users = [
  {
    id: 1,
    name: "name1",
    favMovies: ["movie01"],
  },
  {
    id: 2,
    name: "name2",
    favMovies: [],
  }
];

// Creating GET route at endpoint "/movies" returning JSON object (Returns all movies)
app.get('/movies',(req,res)=>{
    res.json(movies);
})

app.get('/', (req, res) => {
    res.send('Welcome to my movie collection!');
  });

// Creating GET route at endpoint "/movies/title" to return JSON object of a single movie
app.get('/movies/:title', (req, res) => {
  const movie = movies.find((movie) => movie.title === req.params.title);

  if (!movie) {
    const message = 'Movie with the given title not found';
    res.status(404).json({ error: message });
  } else {
    res.status(200).json(movie);
  }
});



// Return data about a genre (description) by the name of the movie
app.get('/movies/:title/genre', (req, res) => {
  let movie = movies.find((movie) => {
    return movie.title === req.params.title;
  });

  if (!movie) {
    const message = 'Movie with the given title not found';
    res.status(404).send(message);
  } else {
    res.status(200).send(movie.genre);
  }
});

// Return data about a director(bio, birth year, death year) by name
app.get('/movies/directors/:directorName',(req,res) => {
  res.json (directors.at.find( (director) =>
    {director.name === req.params.directorName}));

    if(!directorName) {
      const message = 'Missing directors name';
      res.status(404).send(message);
    } else {
      res.status(200).json(movie.director)
    }
  });

// Allow new users to register
app.post("/users",(req,res) =>{
  const newUser = req.body;

  if(newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser);
  } else {
    res.status(400).send("name?");
  }
});

// Allow users to update their user info (username)
app.put('/users/:id',(req,res) => {
  const {id} = req.params;
  const updatedUser = req.body;

  let user = users.find((user)=> user.id == id);
  
  if(user){
    user.name = updatedUser.name;
    res.status(200).json(user);
  }
});

// Allow users to add a movie to their list of favorites

app.post('/users/:id/movies/:title', (req,res) => {
  const { id, title } = req.params;
  const { userId, movieId } = req.body;

  let user = users.find((user)=> user.id == userId);
  let movie = movies.find((movie)=> movie.id == movieId);

  if(movie){
    return res.status(400).json({message: "Movie has been removed"});
  }
});

// Allow users to deregister (only showing text a user email has been removed)

app.delete('/users/:id',(req,res) => {
  const {id} = req.params;
  const userIndex = users.findIndex((user) => user.id == id);

  if(userIndex !== -1) {
    users.splice(userIndex, 1);
    res.status(200).json({message: 'User email has been removed'})
  }
});

app.use(express.static('public'));

// Error-handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Something went wrong');
});
const port = process.env.PORT || 8080;
  app.listen(port, '0.0.0.0',() => {
    console.log('Your app is listening on port 8080.');
  
  });