import express from "express"
const router = express.Router()

import { loginValidation, registerValidation } from "../validations.js";
import { UserController, } from "../controllers/index.js";
import chechAuth from "../utils/chechAuth.js";

router
  .post('/auth/login',loginValidation,UserController.login)
  .post('/auth/registor', registerValidation, UserController.registor)
  .get('/users', chechAuth, UserController.getUser)
  .get('/getme', chechAuth, UserController.getMe)
  .put('/Blockusers/:id', chechAuth, UserController.updateUser)
  .put('/unBlockusers/:id', chechAuth, UserController.ublockUser)
  .put('/BlockAllusers', chechAuth, UserController.BlockAll)
  .delete('/deleteUsers/:id', chechAuth, UserController.removePost)
  .delete('/deleteAllUsers', chechAuth, UserController.removeAll)

export default router;