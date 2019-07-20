const express = require('express');
const UserController = require('../controllers/user');

const router = express.Router();

// /api/user/signup
router.post("/signup", UserController.createUser);
// don't put UserController.createUser(req, resp) but just like this. Express will figure it out

// Validate credentials and if valid, generate and send the token
router.post("/login", UserController.userLogin);

module.exports = {
    router
}
