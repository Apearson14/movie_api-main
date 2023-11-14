const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const morgan = require('morgan');
const uuid = require('uuid');
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/Movies', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());
app.use(morgan('combined'));


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
app.get('/movies/genres/:name', (req, res) => {
 
  const genreName = genres.find((genreName) => genreName.name === req.params.name);

  if (!genreName) {
    const message = 'Genre with this given title is not found';
    res.status(404).send(message);
  } else {
    res.status(200).json(genreName);
  }
});

// Return data about a director(bio, birth year, death year) by name
app.get('/movies/directors/:directorName', (req, res) => {
  const directorName = req.params.directorName;

  const director = directors.find((director) => director.name === directorName);

  if (!director) {
    const message = 'Director with the given name not found';
    res.status(404).json({ error: message });
  } else {
    res.status(200).json(director);
  }
});


// Allow new users to register
app.post("/users", (req, res) => {
  const newUser = req.body;

  if (newUser.name) {
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

  let user = users.find((user)=> user.id == id);
  let movie = movies.find((movie)=> movie.title === title); 

  if (!user || !movie) {
    return res.status(404).json({ message: "User or movie not found" });
  } else {
    user.favMovies.push(movie.title);
    res.status(200).json({ message: "Movie added to favorites" }); 
  }
});

// Remove a movie from the favorites list of a single user

app.delete('/users/:id/movies/:title', (req, res) => {
  const userId = req.params.id;
  const movieTitle = req.params.title;
  const user = users.find((user) => user.id == userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const movieIndex = user.favMovies.indexOf(movieTitle);

  if (movieIndex === -1) {
    return res.status(404).json({ message: "Movie not found in user's favorites" });
  }

  user.favMovies.splice(movieIndex, 1);

  res.status(200).json({ message: "Movie removed from favorites" });
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