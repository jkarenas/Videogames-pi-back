const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const getVideogames = require("./getVideogames")
const postVideogames = require("./postVideogames")
const getVideogameById = require("./getVideogameById")
const getGenres = require("./getGenres")
const getVideogamesByName = require("./getVideogamesByName")

const router = Router();

router.get("/videogames/:id", getVideogameById)
// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.use("/genres", getGenres)
router.get("/", getVideogamesByName)
router.post("/videogames",postVideogames)
router.get("/videogames",getVideogames)

module.exports = router;
