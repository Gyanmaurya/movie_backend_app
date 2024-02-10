
const express =  require('express');
const router = express.Router();
const userController = require('../moviesController/userController');



router.route('/Allusers').get(userController.getAlluser)
router.route('/createUser').post(userController.createUser);
router.route('/sign').post(userController.signUp)





module.exports = router;