const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

const moviesRouter = require("./Router/moviesRouter");
const userRouter = require("./Router/userRouter");
const CustomError = require("./utils/CostomError");
const globalErrorController = require("./moviesController/ErrorHadlerGlobal");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require('xss-clean')
const hpp = require('hpp')
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 20,
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});
app.use(helmet());
app.use("/api", limiter);
app.use(express.json());
app.use(mongoSanitize());
app.use(xss())
app.use(hpp({whitelist:['duration','ratings','releaseDate']}))
app.use(express.static("./public"));
app.use("/api/v1/movies", moviesRouter);
app.use("/api/v1/user", userRouter);
app.all("*", (req, res, next) => {
  //  let err = new Error(`This route ${req.originalUrl} not handle by seerver `);
  //  err.status = 'Fail',
  //  err.statusCode = 404;
  //  next(err)

  const err = new CustomError(
    `This route ${req.originalUrl} not handle by seerver `,
    404
  );
  next(err);
});

app.use(globalErrorController);
module.exports = app;
