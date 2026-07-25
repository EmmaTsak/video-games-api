const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

// Authentication routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// User CRUD routes
router
  .route('/')
  .get(gameController.getAllGames)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    gameController.createGame
  );

router
  .route('/:id')
  .get(gameController.getGame)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    gameController.updateGame
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    gameController.deleteGame
  );

module.exports = router;