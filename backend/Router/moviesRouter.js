
const express = require('express');
const moviesController = require('../moviesController/moviesController')
const userController = require('../moviesController/userController')
const router = express.Router();



// router.param('id' , moviesController.checkId)
router.route('/movie-stats').get(moviesController.getMovieStats)
router.route('/movie-genres/:genre').get(moviesController.getMovieBygenre)
router.route('/high-rated').get(moviesController.highRated,moviesController.getAllMovies)
router.route("/")
    .get(userController.protect ,moviesController.getAllMovies)
    .post(moviesController.addMovies)
router.route("/:id")
    .get(moviesController.getMoviesById)
    .delete(userController.protect, userController.restrict('admin') ,moviesController.deleteMovies)
    .patch(moviesController.updateMovies)
    .put(moviesController.updateMovies)

module.exports = router;