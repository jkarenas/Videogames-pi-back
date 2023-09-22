const { Videogame, Genre } = require("../db");
const { API_KEY } = process.env;
const axios = require("axios");
require("dotenv").config();

const getVideogames = async (req, res) => {
    const pageSize = 20;

    try {
        let apiAllGames = [];
        for (let page = 1; page <= 5; page++) {
            const { data } = await axios.get(
                `https://api.rawg.io/api/games?key=${API_KEY}&page=${page}&page_size=${pageSize}`
            );
            const apiVideogames = data.results;
            if (apiVideogames.length === 0) {
                res.status(400).json("Couldn't get the videogames");
                return;
            }
            apiAllGames = apiAllGames.concat(apiVideogames);
        }

        const dbVideogames = await Videogame.findAll({
            include: {
                model: Genre,
                attributes: ["name"],
                through: { attributes: [] },
            },
        });

        const dbGamesMapped = dbVideogames.map((game) => ({
            id: game.id,
            name: game.name,
            image: game.image,
            genres: game.Genres.map((genre) => ({ name: genre.name })),
            released: game.released,
            rating: game.rating,
            platforms: game.platforms,
            isdb:true
        }));

        // Fusionar los videojuegos de la API y la base de datos
        const gamesFiltered = apiAllGames.map((game) => ({
            id: game.id,
            name: game.name,
            image: game.background_image || game.image,
            genres: game.genres?.map((g) => ({ name: g.name })),
            released: game.released,
            rating: game.rating,
            platforms: game.platforms?.map((el) => el.platform.name),
        }));

        const allGames = [...dbGamesMapped, ...gamesFiltered];

        res.status(200).json(allGames);
    } catch (error) {
        res.status(400).json("Not found");
    }
};

module.exports = getVideogames;
