const { Videogame, Genre } = require('../db');

const getDataBaseGames = async (req, res) => {
  try {
    const dbGames = await Videogame.findAll({
      include: {
        model: Genre,
        as: 'genres',
        attributes: ['name']
      }
  });

    const data = dbGames?.map(vgames => ({
      name: vgames.name,
      id: vgames.id,
      image: vgames.image,
      description: vgames.description,
      released: vgames.released,
      rating: vgames.rating,
      platforms: vgames.platforms,
      genres: vgames.genres ? vgames.genres.map(g => g.name): [],
      create: vgames.create,
      source: 'database'
    }));

    return data;
  } catch (error) {
    console.error('Error al obtener datos de la base de datos:', error.message);
    throw error;
  }
}

module.exports = getDataBaseGames;