const CustomError = require("../utils/CostomError")

const devError = (res,error)=>{
     res.status( error.statusCode).send({
          status:error.status,
          message: error.message,
          errorStack:error.stack,
          error:error
     
     })
}

const podError = (res,error)=>{
     if(error.isOperational){
          res.status( error.statusCode).send({
               status:error.status,
               message: error.message
          
          })
     }
     else{
          res.status( error.statusCode).send({
               status:error.status,
               message: 'Some things went wrong please try after some time !'
          
          })
     }
}


module.exports =(error,req,res,next)=>{
    
     error.statusCode = error.statusCode || 500;
     error.status = error.status || 'Fails';
   
  if(process.env.NODE_ENV ==='development'){
//     if(error.name === 'ObjectId'){
//           console.log(error)
//           const msg = `This id ${error.value} not valid for ${error.path}`
//           const err =new CustomError(msg,500)
//         return  next(err)
//      }
if(error.code===11000){
    return res.status(404).send({
          status:"failed",
          msg:error.message
     })
}
     devError(res,error)
 }
 else if(process.env.NODE_ENV ==='production'){
     console.log(process.env)
     // if(error.name === 'CastError'){
     //      // console.log(error)
     //      const msg = `This id ${error.value} not valid for ${error.path}`
     //      const err =new CustomError(msg,500)
     //    return  next(err)
     // }
     podError(res,error)
 }


}