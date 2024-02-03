const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config({path:"./config/config.env"})

const moviesRouter = require('./Router/moviesRouter');
const CustomError = require('./utils/CostomError');
const globalErrorController = require('./moviesController/ErrorHadlerGlobal')
app.use(express.json())
app.use(express.static('./public'))
app.use('/api/v1/movies',moviesRouter)
app.all('*',(req,res,next)=>{
//  let err = new Error(`This route ${req.originalUrl} not handle by seerver `);
//  err.status = 'Fail',
//  err.statusCode = 404;
//  next(err)

const err = new CustomError(`This route ${req.originalUrl} not handle by seerver `,404)
next(err)
})

app.use(globalErrorController)
module.exports = app;