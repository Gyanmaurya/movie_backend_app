const fs = require('fs');
const Movie = require('../Models/moviesModel');
const ApiFeatures = require('../utils/ApiFeatures');

const asyncErrorHandler = require('../utils/asyncErrorHandler');
const CustomError = require('../utils/CostomError');
const { argv } = require('process');

// const { query } = require('express');
// const movies = JSON.parse(fs.readFileSync('./data/movies.json', 'utf-8'));


// Need to comment when don't want to use this because we use mongoose lavel validation in Schema creation time

// exports.validateSchema = (req,res,next)=>{
  
//      if(!req.body.name || !req.body.releaseYear){
//           return res.status(400).json({
//               status: 'fail',
//               message: 'You have to write movies name and releaseYear'
//           });
//       }
//       next();

// }

// this fuction no more use because we use findBy id query in monggose which help on same

// exports.checkId = (req, res, next, value) => {

//      // console.log(value)

//      const obj = movies.find((el) => el.id === +value);
//      // console.log(obj)
//      if (!obj) {
//           return res.status(404).send({
//                status: "fails",
//                message: `We did't get this ${value} in database`
//           })
//      }

//      next()

// }

exports.highRated = async(req,res,next)=>{
  req.query.limit='5';
  req.query.sort='-ratings';
  next()
}

exports.getAllMovies = asyncErrorHandler(async (req, res) => {

  
          
          const features = new ApiFeatures(Movie.find(), req.query)
                                  .filter()
                                  .sort()
                                  .limitFields()
                                  .paginate();

                                  
          let movies = await features.query.find(features.query);
          // console.log(req.query)
          // let movies = await Movie.find(req.query);
          // console.log(typeof(features.find()))
          //Mongoose 6.0 or less
          /**************Mongoose 6.0 or less************** 
          const excludeFields = ['sort', 'page', 'limit', 'fields'];
          const queryObj = {...req.query};
          excludeFields.forEach((el) => {
              delete queryObj[el]
          })
          const movies = await Movie.find(queryObj);
          **************************************************/
  
          res.status(200).json({
              status: 'success',
              length: movies.length,
              data: movies
          });
     
 
})


exports.getMoviesById = asyncErrorHandler(async(req, res, next) => {

      // Json file level code 
     // let id = +req.params.id;

     // let obj = movies.find((el) => el.id === id);

     // res.status(200).send({
     //      status: true,
     //      movies: obj
     // })

    

     const movie= await Movie.findById(req.params.id)

     if(!movie){
          const err = new CustomError('Movie not found for this ID',404)
         return next(err)
     }
     res.status(200).send({
          movie:movie,
          message:'movie get sucessefully'

     })
     
   

})

exports.addMovies = asyncErrorHandler(async(req, res, next) => {
 // Json file level code 
     // This method use for when we dont't deal with database we have only one json files
     // const index = movies[movies.length - 1].id + 1;
     // const newId = index;
     // const objectMovies = Object.assign({ id: newId }, req.body);

     // movies.push(objectMovies)
     // fs.writeFile('./data/movies.json', JSON.stringify(movies), (err) => {
     //      res.status(200).send({
     //           status: true,
     //           movies: objectMovies
     //      })
     // })


   
          const movie = await Movie.create(req.body);
          res.status(200).send({
               movie:movie,
               message:"Movie Added successfully"

          }) 
     
})

// upadte movies

exports.updateMovies =asyncErrorHandler(async(req, res, next) => {

      // Json file level code 
     // const id = +req.params.id;
     // const upadteMovie = movies.find((el) => el.id === id);
     // const movieIndex = movies.indexOf(upadteMovie)
     // const newUpadteMovie = Object.assign(upadteMovie, req.body);
     // movies[movieIndex] = newUpadteMovie
     // //  console.log(movies)
     // fs.writeFile('./data/movies.json', JSON.stringify(movies), (error) => {
     //      res.status(200).send({
     //           status: true,
     //           movies: newUpadteMovie
     //      })
     // })

    

          const movie= await Movie.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
          res.status(200).send({
               movie:movie,
               message:'movie get sucessefully'
     
          })
       
})

// delete movies

exports.deleteMovies = asyncErrorHandler(async(req, res, next) => {

     // Json file level code 
     // const id = +req.params.id;
     // const deleteMovie = movies.find(el => el.id === id);
     // const deleteIndex = movies.indexOf(deleteMovie);
     // movies.splice(deleteIndex, 1);
     // fs.writeFile('./data/movies.json', JSON.stringify(movies), (error) => {
     //      res.status(200).send({
     //           status: true,
     //           movies: deleteMovie,
     //           message: "delete successfully"
     //      })
     // })
   

          const movie= await Movie.findByIdAndDelete(req.params.id)
          res.status(200).send({
               movie:movie,
               message:'movie delete sucessefully'
     
          })
          


     
})

exports.getMovieStats = asyncErrorHandler(async (req,res,next)=>{

   
          let stats = await Movie.aggregate([
               {$match:{ratings:{$gte:7}}},
               {$group:{
                    _id:'$releaseYear',
                    avgRatings:{$avg : '$ratings'},
                    avgPrice:{$avg : '$price'},
                    maxPrice:{$max: '$price'},
                    minPrice:{$min : '$price'},
                    totalPrice:{$sum : '$price'},
                    movieCount:{$sum :1}
               }},
               // {$sort:{maxPrice:1}},
               // {$match:{maxPrice:{$gte:65}}},

          ])

          res.status(200).send({
         count:stats.length,      
         movieStats:stats,
         message:'Getiings all aggregate Data'
          })
          
     

})

exports.getMovieBygenre =asyncErrorHandler(async (req,res,next)=>{

  const genresss = req.body.params;
 

  let stats = await Movie.aggregate([
     {$unwind: '$genres'},
     {$group :{
          _id:'$genres',
          movieCount: {$sum:1},
          movie:{$push:'$name'},
     }},
     {$addFields:{genre:'$_id'}},
     {$project:{_id:0}},
      {$limit: 1}
  ])

 res.status(200).send({
         movie:stats,
         message:'Getiings all aggregate genras'
          })

})


