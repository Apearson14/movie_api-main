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


app.get('/movies', async (req, res) => {
  try {
    console.log('Before fetching movies');
    const movies = await Movies.find({});
    console.log('After fetching movies');
    res.json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/', (req, res) => {
  res.send('Welcome to my movie collection!');
});

// Creating GET route at endpoint "/movies/title" to return JSON object of a single movie
app.get('/Movies/:title', async (req, res) => {
  try {
    const movie = await Movies.findOne({ title: req.params.title });

    if (!movie) {
      const message = 'Movie with the given title not found';
      res.status(404).json({ error: message });
    } else {
      res.status(200).json(movie);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Return data about a genre (description) by the name of the movie
app.get('/movies/genres/:name', async (req, res) => {
  try {
    const genre = await Movies.findOne({ genre: req.params.name });

    if (!genre) {
      const message = 'Genre with this given title is not found';
      res.status(404).send(message);
    } else {
      res.status(200).json(genre);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Return data about a director(bio, birth year, death year) by name
app.get('/movies/directors/:directorName', async (req, res) => {
  try {
    const director = await Movies.findOne({ director: req.params.directorName });

    if (!director) {
      const message = 'Director with the given name not found';
      res.status(404).json({ error: message });
    } else {
      res.status(200).json(director);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


app.post("/users", async (req, res) => {
  try {
    const newUser = req.body;

    if (newUser.name) {
      newUser.id = mongoose.Types.ObjectId();
      const user = new Users(newUser);
      await user.save();
      res.status(201).json(newUser);
    } else {
      res.status(400).send("name?");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


// Allow users to update their user info (username)
app.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = req.body;

    const user = await Users.findById(id);

    if (user) {
      user.name = updatedUser.name;
      await user.save();
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Allow users to add a movie to their list of favorites
app.post('/users/:id/movies/:title', async (req, res) => {
  try {
    const { id, title } = req.params;

    const user = await Users.findById(id);
    const movie = await Movies.findOne({ title });

    if (!user || !movie) {
      return res.status(404).json({ message: "User or movie not found" });
    } else {
      user.favMovies.push(movie.title);
      await user.save();
      res.status(200).json({ message: "Movie added to favorites" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Remove a movie from the favorites list of a single user

app.delete('/users/:id/movies/:title', async (req, res) => {
  try {
    const { id, title } = req.params;

    const user = await Users.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const movieIndex = user.favMovies.indexOf(title);

    if (movieIndex === -1) {
      return res.status(404).json({ message: "Movie not found in user's favorites" });
    }

    user.favMovies.splice(movieIndex, 1);
    await user.save();

    res.status(200).json({ message: "Movie removed from favorites" });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


// Allow users to deregister (only showing text a user email has been removed)

app.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Users.findByIdAndRemove(id);

    res.status(200).json({ message: 'User email has been removed' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Something went wrong');
});

app.use(express.static('public'));

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log(`Your app is listening on port ${port}`);
});