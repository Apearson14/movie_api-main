const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let movieSchema = mongoose.Schema({
    Title: {type: String, required: true},
    Description: {type: String, required: true},
    Genre: {
        Name: String,
        Description: String
    },
    Director: {
        Name: String,
        Bio: String
    },
    Actors: [String],
    ImagePath: String,
    Featured: Boolean
});

let userSchema = mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    Birthday: Date,
    FavoriteMovies: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
});

userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};

userSchema.statics.validatePassword = (password) => {
    return bcrypt.compareSync(password, this.password);
};

let genreSchema = mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true}
});

let directorSchema = mongoose.Schema({
    name: {type: String, required: true},
    bio: {type: String, required: true},
    birthday: Date,
    "death date": Date
});


let Director = mongoose.model('Directors', directorSchema);
let Genre = mongoose.model('Genres', genreSchema);
let Movie = mongoose.model('Movies', movieSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;
module.exports.Director = Director;
module.exports.Genre = Genre;
