const axios = require("axios");
const { API_KEY } = process.env;
const { Videogame, Genre } = require("../db");
const { validate: validateUUID } = require('uuid');

const fetchApiData = async (id) => {
    try {
        const response = await axios.get(`https://api.rawg.io/api/games/${id}?key=${API_KEY}`);
        console.log(response)
        if (response.data) {
            const vgData = response.data;
            const info = {
                id: vgData.id,
                name: vgData.name,
                image: vgData.background_image,
                genres: vgData.genres?.map(g => g.name),
                description: vgData.description,
                released: vgData.released,
                rating: vgData.rating,
                platforms: vgData.platforms?.map(el => el.platform.name)
            };
            return info;
        } else {
            return null;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
};

const fetchDbData = async (id) => {
    try {
        return await Videogame.findByPk(id, {
            include: [{
                model: Genre,
                attributes: ['name'],
                through: {
                    attributes: []
                }
            }]
        });
    } catch (error) {
        console.error(error);
        return null;
    }
};

const getVideogameById = async (req, res) => {
    const idVideogame = req.params.id;

    try {
        let data;
        if (validateUUID(idVideogame)) {
            data = await fetchDbData(idVideogame);
        } else {
            data = await fetchApiData(idVideogame);
        }

        if (data) {
            console.log("Response Data:", data);
            res.status(200).json(data);
        } else {
            res.status(404).json({ error: "Video game not found :O" });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Couldn't get info" });
    }
};

module.exports = getVideogameById;
