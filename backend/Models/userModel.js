const { default: mongoose } = require("mongoose");
const validator= require('validator')
var bcrypt = require('bcryptjs');

const crypto = require('crypto')


const userSchema = mongoose.Schema({
     name:{
          type:String,
          require:[true,'Please enter the name']
         
     },
     email:{
          type:String,
          require:[true,'Please enter the email'],
          validate:[validator.isEmail,'Please input valid email'],
          lowercase: true,
         
     },
     photo:String,
     password:{
          type:String,
          require:[true, 'Enter the password'],
          minlength:8

     },
     conformepassword:{
          type:String,
          require:[true, 'Enter the password'],
          validate: {
               validator: function (v) {
                 
                 return this.password === v;
               },
               message: 'Passwords do not match',
             },
        

     },
     role:{
          type:String,
          enum:["admin","user"],
          default:"user"
     },
     passwordchangeAt:Date,
     resetPasswordToken: {
         type:String
     },
     resetPasswordExpire: {
          type:Date
      }
})

userSchema.pre('save', async function(next){
    console.log(this.isModified('password'))
     if(!this.isModified('password')) return next()
     this.password = await bcrypt.hashSync(this.password, 8);
    this.conformepassword = undefined
    console.log(this.password)
   next()
})

userSchema.methods.comparedPas =async function(pass,passDB){
 return bcrypt.compare(pass,passDB)
}

userSchema.methods.isPasswordChanged = async function(isTimestamptoken){
if(this.passwordchangeAt){
     const psdTimestamp = parseInt(this.passwordchangeAt.getTime()/1000,10);
     return isTimestamptoken<psdTimestamp
}
return false
}

userSchema.methods.isResetPassword = async function(){
     const resetToken = crypto.randomBytes(32).toString('hex')
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordExpire = Date.now()+10*60*1000;
//     console.log(resetToken,this.resetPasswordToken,this.resetPasswordExpire)
return resetToken
}

const User = mongoose.model('user',userSchema);
module.exports = User;