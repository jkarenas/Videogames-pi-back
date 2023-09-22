const {Genre} = require("../db")
const {Videogame} = require("../db")
const {API_KEY} = process.env;
const { Op } = require('sequelize');
const axios = require('axios');


const getVideogamesByName = async(req,res)=>{
    console.log("laverga")

    const {name}= req.query
    // console.log(name)
    try{//busco  en la db
        const dbByname = await Videogame.findAll({
            where: {
                name:{
                    [Op.iLike]: `%${name}%`
                }
            },
            include : [{
                model: Genre,
                attribute: ["name"],
                through: { attributes: []}
            }]
        });
        console.log("la db por name: ",dbByname)
        //Busco en la api
        const dbGamesMapped = dbByname.map((game) => ({
            id: game.id,
            name: game.name,
            image: game.image,
            genres: game.Genres.map((genre) => ({ name: genre.name })),
            released: game.released,
            rating: game.rating,
            platforms: game.platforms?.map(el => el.platform.name)
        }));


        const foundGame = await axios.get(
            `https://api.rawg.io/api/games?search=${name}&key=${API_KEY}`
            
        );
        console.log("la data:",foundGame.data.results)

        const apiByName = foundGame.data.results.map((videogame)=>{
            return {
                id: videogame.id,
                name: videogame.name,
                image: videogame.background_image,
                genres: videogame.genres.length > 0 ? videogame.genres.map((genre) =>({name:genre.name})  ): [],
                released: videogame.released,
                rating: videogame.rating,
                platforms: videogame.platforms?.map(el => el.platform.name)
                
            }
        })
        console.log("la api by name:",apiByName)
        const videogameByName = [...dbGamesMapped,...apiByName]
        if (videogameByName.length === 0){
            throw Error("no se encontro el juego")
        }
        if(videogameByName.length>15){
            const videogameByNameSliced = videogameByName.slice(0,15);
            return res.status(200).json(videogameByNameSliced)
        }
        return res.status(200).json(videogameByName)
    }catch(error){
            res.status(400).json({error: error.message})
    }
    


}
module.exports = getVideogamesByName