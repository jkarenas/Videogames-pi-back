

// se define la funcion asincrona postVideogames
//dentro de trycatch:
//se destructura el cuerpo de la solicitud (req.body)
//si todas las propiedades requeridas se encuentran por body, 
//se crea un objeto Videogame usando el metodo create (no olvidar el await)
//si la propiedad genres tambien esta presente, y es mayor a 0, la bucamos en 
//la base de datos con findAll y  where:{name: genres}
//despues de obtener lo games de la db , se asocian acon el nuevo juego con addGenre


// const { Videogame, Genre } = require("../db");

// const postVideogames = async (req,res) => {
//   try {
//     const {name, description, platforms, image, released, rating, genre} = req.body
    
//     if(name && description && platforms && image && released && rating ){
//       const newGame = await  Videogame.create({
//         name,
//         description,
//         platforms,
//         image,
//         released,
//         rating
//       })
    
//     if(genre && genre.length>0){
//       const genreInDb =  Genre.findAll({
//           where:{
//           name :  genre
//         }
//       }   
//     )
//     await newGame.addGenre(genreInDb)
//   } 
// }
//     res.status(200).json("posted succesfully")
//   } catch (error) {
//     res.status(400).json("couldn' post")
//   }
 
// }

// module.exports = postVideogames;







const { Videogame, Genre } = require("../db");

const postVideogames = async (req, res) => {
  try {
    const { name, description, platforms, image, released, rating, genres } = req.body;
    console.log("Received data:", { name, description, platforms, image, released, rating, genres });

    if (name && description && platforms && image && released && rating) {
      const newGame = await Videogame.create({
        name,
        description,
        platforms,
        image,
        released,
        rating,
      });

      // Associate genres with the new game
      if (genres && genres.length > 0) {
        const genresToAdd = await Genre.findAll({
            where:{
                name:genres
            }

        });
        await newGame.addGenre(genresToAdd)
      }

      return res.send(newGame);
    } else {
      return res.status(400).json("Missing data");
    }
  } catch (error) {
    res.status(400).json("coulnt post")
  }
};

module.exports = postVideogames;
