
const express =  require('express');
const router = express.Router();
const userController = require('../moviesController/userController');



router.route('/Allusers').get(userController.getAlluser)
router.route('/createUser').post(userController.createUser);
router.route('/sign').post(userController.signUp)
router.route('/forgetPassword').post(userController.forgetPassword)
router.route('/resetPassword/:token').patch(userController.resetPassword)





module.exports = router;