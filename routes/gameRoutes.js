const express = require('express');
const gameController = require('../controllers/gameController');

const router = express.Router();

// Aggregate endpoints
router.route('/top-5-rated-query')
  .get(gameController.aliasTopGames, gameController.getAllGames);

router.route('/top-5-cheap')
  .get(gameController.aliasTopCheapGames, gameController.getAllGames);
  
router.route('/stats')
  .get(gameController.getGameStats);

router.route('/by-genre')
  .get(gameController.getGamesByGenre);

router.route('/by-company')
  .get(gameController.getGamesByCompany);

// CRUD routes
router
  .route('/')
  .get(gameController.getAllGames)
  .post(gameController.createGame);

router
  .route('/:id')
  .get(gameController.getGame)
  .patch(gameController.updateGame)
  .delete(gameController.deleteGame);

module.exports = router;