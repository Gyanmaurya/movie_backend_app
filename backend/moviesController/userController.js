const User = require("../Models/userModel");
const CustomError = require("../utils/CostomError");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
var jwt = require("jsonwebtoken");
const util = require("util");
const sendMail = require("../utils/email");
const crypto = require("crypto");

const Signtoken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: 60000,
  });
};

exports.getAlluser = asyncErrorHandler(async (req, res, next) => {
  const user = await User.find();
  res.status(200).send({
    userAll: user,
    message: "getting data sucessfully",
  });
});

exports.createUser = asyncErrorHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  const token = Signtoken(user._id);
  const options = {
          
          Expires: 300000,
          httpOnly: true
  }
  if(process.env.NODE_ENV="production"){
     options.secure=true
  }
  res.cookie("jwt", token, );
  res.status(200).send({
    user: user,
    token,
    message: "User Added successfully",
  });
});

exports.signUp = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const err = new CustomError("Please put email and password", 400);
    return next(err);
  }

  const user = await User.findOne({ email });
  console.log(user);
  if (!user || !(await user.comparedPas(password, user.password))) {
    const err = new CustomError("User or password not matched try again", 400);
    return next(err);
  }
  const token = Signtoken(user._id);

  res.status(200).send({
    message: "user is login successfully ",
    token,
  });
});

exports.protect = asyncErrorHandler(async (req, res, next) => {
  const testToken = req.headers.authorization;

  let token;
  if (testToken && testToken.startsWith("Bearer")) {
    token = testToken.split(" ")[1];
    //   console.log(token)
  }
  if (!token) {
    const err = new CustomError("please provide token", 404);
    return next(err);
  }

  // validate the token

  const decodedToken = util.promisify(jwt.verify)(
    token,
    process.env.SECRET_KEY
  );
  //
  const user = await User.findOne(decodedToken.id);
  //   console.log(decodedToken)
  if (!user) {
    const err = new CustomError(
      "This user with given token does not exist",
      404
    );
    return next(err);
  }

  let psdChanged = await user.isPasswordChanged(decodedToken.iat);
  if (psdChanged) {
    const err = new CustomError(
      "This user recentely changed the password please login again",
      404
    );
    return next(err);
  }
  req.user = user;
  next();
});

exports.restrict = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      const err = new CustomError(
        "You are not authrize person to delete the movie",
        404
      );
      next(err);
    }
    next();
  };
};

exports.forgetPassword = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    const err = new CustomError("User is not registered", 404);
    return next(err);
  }

  const resetToken = await user.isResetPassword();

  // Save the user after setting the reset token, if necessary
  await user.save();

  // sending the token in emails
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/user/resetPassword/${resetToken}`;
  const message = `We have get reset password request please use below link to reset password \n\n ${resetURL}\n\n This password link valid only for 10 mintues`;

  try {
    await sendMail({
      email: user.email,
      message: message,
      subject: "Password reset request",
    });

    res.status(200).send({
      message: "Reset token generated successfully",
    });
  } catch (error) {
    console.log(process.env.HOST_EMAIL);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    user.save({ validateBeforeSave: false });
    next(
      new CustomError(
        "There was error send the emails, Please try after sometime!"
      )
    );
  }
});

exports.resetPassword = asyncErrorHandler(async (req, res, next) => {
  const token = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    const err = new CustomError("This token is not valid", 404);
    return next(err);
  }

  // res.status(200).send({
  //      message: "Reset token generated successfully",
  //      user:user

  // })

  user.password = req.body.password;
  user.conformepassword = req.body.conformepassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  user.passwordchangeAt = Date.now();

  user.save();
  const usertoken = Signtoken(user._id);

  res.status(200).send({
    message: "user is login successfully ",
    usertoken,
  });
});

exports.updatePassword = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!(await user.comparedPas(req.body.currentPass, user.password))) {
    const err = new CustomError("Password are not matched", 404);
    next(err);
  }

  user.password = req.body.password;
  user.conformepassword = req.body.conformepassword;
  user.passwordchangeAt = Date.now();
  await user.save();

  const usertoken = Signtoken(user._id);

  res.status(200).send({
    message: "user is login successfully ",
    usertoken,
  });
});
const filterReqObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((prop) => {
    if (allowedFields.includes(prop)) {
      newObj[prop] = obj[prop];
    }
  });
  return newObj;
};
exports.updateMe = asyncErrorHandler(async (req, res, next) => {
  if (req.body.password || req.body.conformepassword) {
    next(
      new CustomError("You can not change the password using this end point"),
      404
    );
  }
  const filterObj = filterReqObj(req.body, "name", "email");
  const updateUser = await User.findByIdAndUpdate(req.user.id, filterObj, {
    runValidators: true,
    new: true,
  });
  res.status(200).send({
    status: true,
    updateUser,
  });
});

exports.deleteMe = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user._id, { Active: false });
  console.log(user);
  res.status(200).json({
    message: "User delete successfully1",
    data: user,
  });
});
