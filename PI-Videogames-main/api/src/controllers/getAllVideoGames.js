const axios = require('axios');
const getDBData = require('./getDataBaseGames');
const getApiData = require('./getApiDataGame');
const { Videogame, Genres } = require('../db');
const { getGamesByName, getGamesByNameDB } = require('./getGameByName');

const getAllVideogames = async (req, res, next) => {
  const { name } = req.query;

  try {
    if (!name) {
      let apiData = await getApiData();
      let DBData = await getDBData();

      if (!apiData && !DBData) {
        console.log('No se encontraron datos');
        return res.status(404).json({ ok: false, error: "No se encontraron datos" });
      }

      let allData = [...DBData, ...apiData];
      console.log(allData.length + ' datos encontrados, se devuelven');
      return res.status(200).json({ok: true, arrVideogames: allData});
    } else {
      let apiDataByName = await getGamesByName(name);
      let DBDataByName = await getGamesByNameDB(name);

      if (!apiDataByName.length && !DBDataByName.length) {
        console.log('No se encontraron datos para el nombre proporcionado');
        return res.status(404).json({ ok: false, error: "No se encontraron datos para el nombre proporcionado" });
      }

      let allDataByName = [...DBDataByName, ...apiDataByName];
      let dataSlice = allDataByName.slice(0, 100);
      console.log(dataSlice.length + ' datos encontrados para el nombre proporcionado');
      return res.status(200).json({ok: true, arrVideogames: dataSlice});
    }
  } catch (error) {
    console.error('Error al obtener los datos:', error.message);
    return next(error);
  }
};

module.exports = getAllVideogames;