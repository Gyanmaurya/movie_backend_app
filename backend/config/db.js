
const mongoose = require('mongoose');
const url = process.env.URL;


exports.connectDB = ()=>{
   return  mongoose.connect(url).then(()=>{
          console.log(`Connected to database properly `)
         })
   
}





