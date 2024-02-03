

const mongoose = require('mongoose');
var validator = require('validator');
 
const movieSchema = new mongoose.Schema({
     name: {
         type: String,
         required: [true, 'Name is required field!'],
         unique: true,
        //  validate: [validator.isAlpha, 'Only contian alphabate']
     },
     description: {
         type: String,
         required: [true, 'Description is required field!'],
         trim: true
     },
     duration: {
         type: Number,
         required: [true, 'Duration is required field!']
     },
     ratings: {
         type:Number,
         validate: {
            validator:function(value){
                return value>=1 && value <= 10
             },
             message:'{VALUE} should  we b/w 1 to 10'
         }
     },
     totalRating: {
         type: Number
     },
     releaseYear: {
         type: Number,
         required: [true, 'Release year is required field!']
     },
     releaseDate:{
         type: Date
     },
     createdAt: {
         type: Date,
         default: Date.now()
         
     },
     genres: {
         type: [String],
         required: [true, 'Genres is required field!'],
         // enum: {
         //      values: ["Action", "Adventure", "Sci-Fi", "Thriller", "Crime", "Drama", "Comedy", "Romance", "Biography"],
         //      message: "This genre does not exist"
         // }
     },
     directors: {
         type: [String],
         required: [true, 'Directors is required field!']
     },
     coverImage:{
         type: String,
         require: [true, 'Cover image is required field!']
     },
     actors: {
         type: [String],
         require: [true, 'actors is required field!']
     },
     price: {
         type: Number,
         require: [true, 'Price is required field!']
     },
     createdBy: String
 },{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
 });

 movieSchema.virtual('durationInHr').get(function(){

   return this.duration/60
 })
// save event is trigger only when we create or updated the data
 movieSchema.pre('save',function(next){
   this.createdBy ='Gyan'
   console.log(this)
    next()
 })
 movieSchema.post('save',function(doc,next){

    const content= `post methode for ${doc.name}` 
  console.log(content)
    
    next()
 })
// this is used for Query middleware 
//  movieSchema.pre(/^find/,function(next){
//     this.find({name:'Divergent'})
//     // console.log(this)
//     next()
//  })

 movieSchema.post(/^find/,async function(doc,next){
    this.find({name:'Divergent'})
    
    next()
 })
 movieSchema.pre('aggregate', function(next){
   this.pipeline().unshift({$match:{releaseDate:{$lte:new Date()}}})
    next()
 })

 const Movie = mongoose.model('movie',movieSchema);

 module.exports =Movie;

