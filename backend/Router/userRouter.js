const express = require("express");
const router = express.Router();
const userController = require("../moviesController/userController");

router.route("/Allusers").get(userController.getAlluser);
router.route("/createUser").post(userController.createUser);
router.route("/sign").post(userController.signUp);
router.route("/forgetPassword").post(userController.forgetPassword);
router.route("/resetPassword/:token").patch(userController.resetPassword);
router
  .route("/updatePassword")
  .patch(userController.protect, userController.updatePassword);
router
  .route("/updateMe")
  .patch(userController.protect, userController.updateMe);
router
  .route("/deleteMe")
  .delete(userController.protect, userController.deleteMe);

module.exports = router;
