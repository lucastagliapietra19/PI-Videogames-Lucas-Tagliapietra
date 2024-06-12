const axios = require('axios');
const { Platform } = require('../db'); // Asegúrate de que la ruta sea correcta
require('dotenv').config();
const { API_KEY } = process.env;

const getAllPlatforms = async (req, res, next) => {
  try {
    const platformsApi = await axios.get(`https://api.rawg.io/api/platforms?key=${API_KEY}`);
    const platforms = platformsApi.data.results;

    // Guardar plataformas en la base de datos
    await Promise.all(platforms.map(async (p) => {
      await Platform.findOrCreate({
        where: { id: p.id },
        defaults: { name: p.name }
      });
    }));

    const allPlatforms = await Platform.findAll();
    console.log(allPlatforms.length + ' OK !');
    return res.json(allPlatforms);

  } catch (error) {
    return next(error);
  }
};

module.exports = getAllPlatforms;
