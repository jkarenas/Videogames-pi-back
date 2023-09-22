const axios = require("axios")
const {Router} = require("express")
const {Genre} = require("../db")
const { v4: uuidv4 } = require('uuid');
const { API_KEY } = process.env


const router = Router()

router.get("/", async (req, res, next)=>{
    try {
        const genresInDb = await Genre.findAll()

        if(genresInDb.length === 0){
             const response = await axios.get(`https://api.rawg.io/api/genres?key=${API_KEY}`)
             const apiResponse = response.data.results.map(genres => ({id: uuidv4(), name: genres.name}))
             await Genre.bulkCreate(apiResponse)
        }

       const allGenres = await Genre.findAll()
        res.json(allGenres)
        
    }catch (e){
        next(e)
    }

})

module.exports = router