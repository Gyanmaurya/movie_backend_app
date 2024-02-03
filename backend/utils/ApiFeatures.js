class Apifeatures{
     constructor(query, queryStr){
         this.query = query;
         this.queryStr = queryStr;
     }
 
     filter(){
         let queryString = JSON.stringify(this.queryStr);
         queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
         const queryObj = JSON.parse(queryString);
         this.query = this.query.find(queryObj);
 
         return this;
     }
 
     sort(){
         if(this.queryStr.sort){
          
             const sortBy = this.queryStr.sort.split(',').join(' ');
             console.log(sortBy)
          
            this.query = this.query.sort('price');
           
         }else{
             this.query = this.query.sort('-createdAt');
         }
 
         return this;
     }
 
     limitFields(){
         if(this.queryStr.fields){
             const fields = this.queryStr.fields.split(',').join(' ');
             console.log(fields)
             this.query = this.query.select(fields);
         }else{
             this.query = this.query.select('-__v');
         }
 
         return this;
     }
 
     paginate(){
         const page = +this.queryStr.page || 1;
         const limit = +this.queryStr.limit || 10;
         console.log(page,limit)
         const skip = (page -1) * limit;
     //     console.log('Before pagination:', this.query);
         this.query = this.query.skip(skip).limit(limit)
     //     console.log('After pagination:', this.query);
         // if(this.queryStr.page){
         //     const moviesCount = await Movie.countDocuments();
         //     if(skip >= moviesCount){
         //         throw new Error("This page is not found!");
         //     }
         // }
         return this;
     }
 }
 
 module.exports = Apifeatures;


   
     // Json files lavel code to get all data
     // if (!movies) {
     //      return res.status(404).send({
     //           status: "fails",
     //           message: `We did't get any movies in database`
     //      })
     // }


     // res.status(200).json({
     //      status: true,
     //      movies: movies
     // })


     // try {

     //      const features = new ApiFeatures(Movie.find(), req.query)
     //      .filter()
     //      .sort()
     //      .limitFields()
     //      .paginate();
     
     //      // console.log(req.query)
     //      // const remove = ['sort','fields','limit','page'];
     //      // const queryObj = {...req.query}
     //      // remove.forEach((el)=>{
     //      //     delete queryObj[el]
     //      // });
        
     //      // const getMovie =  await Movie.find(queryObj);
     
     //    //  http://localhost:8000/api/v1/movies/?duration=135&ratings=7.9&sort=1
     // // filter feature
          
     //      // const queryString=JSON.stringify(req.query);
     //      // const modifiedQueryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
     
     //      // const qurObj=JSON.parse(modifiedQueryString)
     //      // let getQueryObj =   Movie.find();
         
     // // Sortings according to query
     //      // if (req.query.sort) {
     //      //      const sortBy = req.query.sort.split(',').join(' ');
              
     //      //      getQueryObj = getQueryObj.sort(sortBy);
     
     //      //    }
     
     
     //    // Limit the fields come in results
     
     // //    if (req.query.fields) {
     // //      const sortBy = req.query.fields.split(',').join(' ');
         
     // //      getQueryObj = getQueryObj.select(sortBy);
     
     // //    }
     // //    else{
     // //      getQueryObj = getQueryObj.select('-__v');
     // //    }
     // //http://localhost:8000/api/v1/movies/?fields=name,ratings,price
     
     // // Pagination start here
     
     // //     const page= +req.query.page || 1
     // //     const limit= +req.query.limit || 3
     // //     const skipCount = (page-1)*limit;
     
     // //     getQueryObj = getQueryObj.skip(skipCount).limit(limit)
     
     // //     if(req.query.page){
     // //      const countMovie= await Movie.countDocuments();
     // //      if(skipCount>=countMovie){
     // //           throw new Error('Skip number greater than total document number')
     // //      }
     // //     }
          
     //      const getMovie= await features.query;
     //      // console.log(getMovie)
     
     
     //      // find({duration:{gt:18},ratings:{gte:2}})
     //      //http://localhost:8000/api/v1/movies/?duration[gt]=135&ratings[gte]=7.9&price[gt]=20
     
     //      //Using mongoose query
     //      // const getMovie = await Movie.find()
     //      // .where('duration')
     //      // .gte(req.query.duration)
     //      // .where('ratings')
     //      // .equals(req.query.ratings)
     
     
     //      res.status(200).send({
     //           count:getMovie.length,
     //           movie:getMovie,
     //           message:'All movie get sucessefully'
     
     //      })
          
     // } catch (error) {
     //      res.status(404).send({
     //           status:"fail",
     //           message:error.message
     
     //      }) 
     // }