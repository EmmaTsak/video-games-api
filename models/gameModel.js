const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A game must have a title'],
    unique: true,
    trim: true
  },
  releaseYear: {
    type: Number,
    required: [true, 'A game must have a release year'],
    min: [1970, 'Release year must be at least 1970'],
    max: [new Date().getFullYear(), 'Release year cannot be in the future']
  },
  rating: {
    type: Number,
    required: [true, 'A game must have a rating'],
    min: [0, 'Rating must be at least 0'],
    max: [10, 'Rating cannot exceed 10']
  },
  company: {
    type: String,
    required: [true, 'A game must have a company']
  },
  type: {
    type: String,
    required: [true, 'A game must have a type']
  },
  description: {
    type: String,
    required: [true, 'A game must have a description'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'A game must have a price'],
    min: [0, 'Price must be at least 0']
  },

  online: Boolean,
  completionTime: Number,
  consoles: [String],
  difficulty: String,
  images: [String],
  genreTags: [String],
  multiplayerModes: [String],
  languages: [String],
  metacriticURL: String,
  awards: [String],
  availableOnStore: Boolean,
  ageRating: String
}, {
  timestamps: true
});

const Game = mongoose.model('Game', gameSchema);
module.exports = Game;