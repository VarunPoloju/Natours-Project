const exp = require('express');
const userController = require('../Controllers/userController');
const authenticationController = require('../Controllers/authenticationController');

const userRouter = exp.Router();

//   =================USERS====================

userRouter.post('/signup', authenticationController.signup);
userRouter.post('/login', authenticationController.login);

// REST ARCHITECTURE FORMAT
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
