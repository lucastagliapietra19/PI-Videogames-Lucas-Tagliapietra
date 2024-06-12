const axios = require('axios');
require('dotenv').config();
const { API_KEY} = process.env;

const getApiDataGame = async (req, res) => {
    try {
        let URL = `https://api.rawg.io/api/games?key=${API_KEY}`;
        let apiData= [];
    
        for (let i = 0; i < 5; i++) {
          const response = await axios.get(URL);
          
          response.data.results.forEach(game => {
            const {
              id,
              name,
              background_image: image,
              description_raw: description,
              released,
              rating,
              platforms,
              genres,
            } = game;
    
            apiData.push({
              id,
              name,
              image,
              description,
              released,
              rating,
              platforms: platforms.map(p => p.platform.name),
              genres: genres.map(g => g.name),
              createdInDB: false,
              source: 'api'
            });
          });
    
          URL = response.data.next;
        }
    
        console.log(apiData,'Data traida con exito');
        return apiData;
      } catch (error) {
        console.error('Error al obtener datos de la API:', error.message);
        throw error;
      }
}

module.exports = getApiDataGame