const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Game = require('../models/gameModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<DATABASE_PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => console.log('DB connection established'))
  .catch(err => {
    console.error('DB connection error:', err);
    process.exit(1);
  });

// Read the video games dataset
const games = JSON.parse(
  fs.readFileSync(`${__dirname}/data/video_games_dataset.json`, 'utf-8')
);

// IMPORT DATA
const importData = async () => {
  try {
    await Game.create(games);
    console.log('Data successfully imported!');
    process.exit();
  } catch (err) {
    console.error('Import error:', err);
    process.exit(1);
  }
};

// DELETE DATA
const deleteData = async () => {
  try {
    await Game.deleteMany();
    console.log('Data successfully deleted!');
    process.exit();
  } catch (err) {
    console.error('Delete error:', err);
    process.exit(1);
  }
};

// Parse command line arguments
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
} else {
  console.log('Usage: node import-dev-data.js --import or --delete');
  process.exit(1);
}