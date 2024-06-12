const axios = require('axios');
require('dotenv').config();
const { API_KEY } = process.env;
const { Videogame, Genre } = require('../db')

const getGameById = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (String(id).includes('-')) {
      const searchDB = await Videogame.findOne({
        where: { id: id },
        include: {
          model: Genre,
          as: 'genres',
          attributes: ['name']
        }
      });
      console.log(searchDB)
      if (!searchDB) return res.json({ ok: false, message: "Videogame not found" })
      // Normaliza los datos para que platforms siempre sea un array de strings
      let foundGameDB = {
        id: searchDB.id,
        name: searchDB.name,
        image: searchDB.image,
        description: searchDB.description,
        released: searchDB.released,
        rating: searchDB.rating,
        platforms: searchDB.platforms?.split(','),
        genres: searchDB.genres ? searchDB.genres.map(g => g.name) : [],
        source: 'database'
      }
      return res.status(200).json({ ok: true, videogame: foundGameDB })
    } else {
      let searchApiId = await axios.get(`https://api.rawg.io/api/games/${id}?key=${API_KEY}`)
      const platform = [];
      const genres = [];
      if (searchApiId.data.platforms) {
        for (let i = 0; i < searchApiId.data.platforms.length; i++) {
          platform.push(searchApiId.data.platforms[i].platform.name);
        }
      }
      if (searchApiId.data.genres) {
        for (let i = 0; i < searchApiId.data.genres.length; i++) {
          genres.push(searchApiId.data.genres[i].name);
        }
      }
      let foundGameApi = {
        id: searchApiId.data.id,
        name: searchApiId.data.name,
        img: searchApiId.data.background_image,
        image: searchApiId.data.background_image_additional,
        description: searchApiId.data.description,
        released: searchApiId.data.released,
        rating: searchApiId.data.rating,
        platforms: platform,
        genres: genres,
        source: 'api'
      }
      return res.status(200).json({ ok: true, videogame: foundGameApi })
    }
  } catch (e) {
    console.log(e)
    throw e // Lanza el error para que pueda ser manejado por getDataID
  }
};

const getDataID = async (req, res, next) => {
  try {
    let game = await getGameById(id);
    if (!game) return res.status(404).json({ msg: "We couldn't find your game" });
    return res.status(200).json(game)
  } catch (e) {
    return next(e)
  };
};

module.exports = { getGameById, getDataID };