const axios = require('axios');
const { Videogame, Genre } = require('../db');
const { API_KEY } = process.env;
const { Op } = require('sequelize');

const getGamesByName = async (name) => {
  const apiResponse = await axios.get(`https://api.rawg.io/api/games?key=${API_KEY}&search=${name}`);
  const apiGames = apiResponse.data.results?.map(game => ({
    id: game.id,
    name: game.name,
    released: game.released,
    rating: game.rating,
    image: game.background_image,
    platforms: game.platforms ? game.platforms.map(p => p.platform.name) : [],
    genres: game.genres ? game.genres.map(g => g.name) : [],
    source: 'api'
  }));

  return apiGames;
};

const getGamesByNameDB = async (name) => {
  const dbGames = await Videogame.findAll({
    where: {
      name: { [Op.iLike]: `%${name}%` }
    },
    include: {
      model: Genre,
      as: 'genres',
      attributes: ['name']
    }
});

  const dbGamesFormatted = dbGames?.map(game => ({
    id: game.id,
    name: game.name,
    released: game.released,
    rating: game.rating,
    image: game.image,
    platforms: game.platforms,
    genres: game.genres ? game.genres.map(g => g.name) : [],
    source: 'database'
  }));

  return dbGamesFormatted;
};

module.exports = {
  getGamesByName,
  getGamesByNameDB
};