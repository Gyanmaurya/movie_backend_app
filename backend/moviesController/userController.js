const User = require('../Models/userModel');
const CustomError = require('../utils/CostomError');
const asyncErrorHandler = require('../utils/asyncErrorHandler')
var jwt = require('jsonwebtoken');
const util =  require('util')

const Signtoken = (id)=>{
     return jwt.sign({id},process.env.SECRET_KEY,{
          expiresIn:60000
          })
}


exports.getAlluser = asyncErrorHandler(async(req,res,next)=>{

const user = await User.find({});
res.status(200).send({
     userAll:user,
     message:'getting data sucessfully'
})

})

exports.createUser = asyncErrorHandler(async(req,res,next)=>{

const user = await User.create(req.body)
const token =Signtoken(user._id)
res.status(200).send({
     user:user,
     token,
     message:"User Added successfully"

}) 
})

exports.signUp = asyncErrorHandler(async(req,res,next)=>{

     const {email,password} = req.body;
     
     if(!email || !password){
         const err = new CustomError('Please put email and password',400);
        return next(err)
     }

     const user = await User.findOne({email});
     console.log(user)
     if(!user || !await user.comparedPas(password,user.password)){
          const err = new CustomError('User or password not matched try again',400);
        return next(err)
     }
     const token = Signtoken(user._id)

   res.status(200).send({
     message:'user is login successfully ',
     token
   })
})

exports.protect = asyncErrorHandler(async(req,res,next)=>{
    const testToken = req.headers.authorization;

    let token;
    if(testToken && testToken.startsWith('Bearer')){
       token = testToken.split(' ')[1];
     //   console.log(token)
    }
    if(!token){
     const err = new CustomError('please provide token',404);
     return next(err)
    }
 
    // validate the token

   const decodedToken=  util.promisify(jwt.verify)(token,process.env.SECRET_KEY);
//    
  const user = await User.find(decodedToken.id);
  console.log(decodedToken)
  if(!user){
     const err = new CustomError('This user with given token does not exist', 404);
    return next(err)
  }

//   let psdChanged = await user.isPasswordChanged(decodedToken.iat)
//     if(psdChanged){
//         const err = new CustomError('This user recentely changed the password please login again',404)
//        return next(err)
//     }
    req.user=user
next()
})