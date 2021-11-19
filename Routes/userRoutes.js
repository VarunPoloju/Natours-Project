const exp = require('express');
const userController = require('../Controllers/userController');
const userRouter = exp.Router();

//   =================USERS====================
userRouter
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
userRouter
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = userRouter;
