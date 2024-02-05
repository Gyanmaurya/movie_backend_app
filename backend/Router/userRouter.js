
const express =  require('express');
const router = express.Router();
const userController = require('../moviesController/userController');



router.route('/Allusers').get(userController.protect,userController.getAlluser)
router.route('/createUser').post(userController.createUser)





module.exports = router;