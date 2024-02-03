
const fs = require('fs');
const monggose = require('mongoose');
const dotenv = require('dotenv');
const Movie = require('../Models/moviesModel');
dotenv.config({path:'./config/config.env'})




console.log(process.argv[2])

var movies = JSON.parse(fs.readFileSync('./data/movies.json', 'utf-8'));
monggose.connect(process.env.URL,{useNewUrlParser:true})
    .then((conn)=>{
      console.log('connection stable with databse')
}).
catch((err)=>{
console.log('Database connection error')
})


// Delete the data which already exist in database

const deletData = async(req,res)=>{

     try {

          const movies = await Movie.deleteMany();
          console.log('Data deleted successfully')
          
     } catch (error) {
           console.log({message: error.message})
     }
     process.exit();
}
// add the data in mongodb database

const addData = async(req,res)=>{

     try {
         
          const x= await Movie.create(movies);
          console.log('Data added successfully')
          
     } catch (error) {
           console.log({message: error.message})
     }
     process.exit();
}


if(process.argv[2]==='--import'){
     addData()
}
if(process.argv[2]==='--delete'){
     deletData() 
}

