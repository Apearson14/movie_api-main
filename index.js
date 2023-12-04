const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const uuid = require('uuid');
const mongoose = require('mongoose');
const { Movie, User, Genre, Director } = require('./models.js');
 

mongoose.connect('mongodb://localhost:27017/CFmovies', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error.message);
  });

app.use(bodyParser.json());
app.use(morgan('combined'));

// Get a list of all the movies in the collection
app.get('/movies', async (req, res) => {
  try {
    console.log('Before fetching movies');
    const moviesList = await Movie.find(); 
    console.log('After fetching movies');
    res.json(moviesList);
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
    const movie = await Movie.findOne({ title: req.params.title });

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
    const genre = await Genre.findOne({ name: req.params.name });

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
    const director = await Director.findOne({ name: req.params.directorName });

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

// Allow new users to register
app.post("/users", async (req, res) => {
  try {
    const newUser = req.body;

    const user = new User({
      ...newUser,
      _id: new mongoose.Types.ObjectId(), // Assign a new ObjectId to the user's ID
    });

    await user.save();
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});




// Allow users to update their user info (username)
app.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = req.body;

    const user = await User.findById(id);

    if (user) {
      user.username = updatedUser.username;
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

    const user = await User.findById(id);
    const movie = await Movie.findOne({ title });

    if (!user || !movie) {
      return res.status(404).json({ message: "User or movie not found" });
    } else {
      user.FavoriteMovies.push(movie._id); // Assuming FavoriteMovies is the correct array field
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

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: `User with ID ${id} not found` });
    }

    const movieIndex = user.FavoriteMovies.indexOf(title);

    if (movieIndex === -1) {
      return res.status(404).json({ message: `Movie '${title}' not found in user's favorites` });
    }

    user.FavoriteMovies.splice(movieIndex, 1);
    await user.save();

    res.status(200).json({ message: `Movie '${title}' removed from favorites` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});



// Allow users to deregister (only showing text a user email has been removed)
app.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findOneAndDelete({ _id: id });

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

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