const Game = require('../models/gameModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// ALIAS MIDDLEWARE for top 5 rated games
exports.aliasTopGames = (req, res, next) => {
  req.query.sort = '-rating';
  req.query.limit = '5';
  req.query.fields = 'title,rating,company,type,price';
  next();
};

// GET ALL GAMES with filtering, sorting, pagination
exports.getAllGames = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Game.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const games = await features.query;

  res.status(200).json({
    status: 'success',
    results: games.length,
    data: {
      games
    }
  });
});

// GET SINGLE GAME
exports.getGame = catchAsync(async (req, res, next) => {
  const game = await Game.findById(req.params.id);

  if (!game) {
    return next(new AppError('No game found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      game
    }
  });
});

// CREATE GAME
exports.createGame = catchAsync(async (req, res, next) => {
  const newGame = await Game.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      game: newGame
    }
  });
});

// UPDATE GAME
exports.updateGame = catchAsync(async (req, res, next) => {
  const game = await Game.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!game) {
    return next(new AppError('No game found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      game
    }
  });
});

// DELETE GAME
exports.deleteGame = catchAsync(async (req, res, next) => {
  const game = await Game.findByIdAndDelete(req.params.id);

  if (!game) {
    return next(new AppError('No game found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// AGGREGATION: Get game statistics
exports.getGameStats = catchAsync(async (req, res, next) => {
  const stats = await Game.aggregate([
    {
      $group: {
        _id: null,
        totalGames: { $sum: 1 },
        avgRating: { $avg: '$rating' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
        avgCompletionTime: { $avg: '$completionTime' }
      }
    },
    {
      $project: {
        _id: 0,
        totalGames: 1,
        avgRating: { $round: ['$avgRating', 2] },
        avgPrice: { $round: ['$avgPrice', 2] },
        minPrice: 1,
        maxPrice: 1,
        avgCompletionTime: { $round: ['$avgCompletionTime', 1] }
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats: stats[0]
    }
  });
});

// AGGREGATION: Get games by genre
exports.getGamesByGenre = catchAsync(async (req, res, next) => {
  const gamesByGenre = await Game.aggregate([
    { $unwind: '$genreTags' },
    {
      $group: {
        _id: '$genreTags',
        count: { $sum: 1 },
        games: { $push: '$title' },
        avgRating: { $avg: '$rating' }
      }
    },
    {
      $project: {
        genre: '$_id',
        count: 1,
        avgRating: { $round: ['$avgRating', 2] },
        sampleGames: { $slice: ['$games', 5] }
      }
    },
    { $sort: { count: -1 } }
  ]);

  res.status(200).json({
    status: 'success',
    results: gamesByGenre.length,
    data: {
      gamesByGenre
    }
  });
});

// AGGREGATION: Get top 5 rated games (using aggregation pipeline)
exports.getTop5Rated = catchAsync(async (req, res, next) => {
  const topGames = await Game.aggregate([
    {
      $match: {
        rating: {
          $gte: 4.0,
          $exists: true
        }
      }
    },
    { $sort: { rating: -1 }},
    { $limit: 5 },
    {
      $project: {
        title: 1,
        rating: 1,
        company: 1,
        type: 1,
        price: 1,
        releaseYear: 1
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    results: topGames.length,
    data: {
      games: topGames
    }
  });
});

// AGGREGATION: Get games by company
exports.getGamesByCompany = catchAsync(async (req, res, next) => {
  const gamesByCompany = await Game.aggregate([
    {
      $group: {
        _id: '$company',
        totalGames: { $sum: 1 },
        avgRating: { $avg: '$rating' },
        games: { $push: '$title' }
      }
    },
    {
      $project: {
        company: '$_id',
        totalGames: 1,
        avgRating: { $round: ['$avgRating', 2] },
        sampleGames: { $slice: ['$games', 3] }
      }
    },
    { $sort: { totalGames: -1 } }
  ]);

  res.status(200).json({
    status: 'success',
    results: gamesByCompany.length,
    data: {
      gamesByCompany
    }
  });
});