const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { UserModel } = require('../models/user');

const router = express.Router();

// /api/user/signup
router.post("/signup", async (req, resp, next) => {
    try {
        const passwordHash = await bcrypt.hash(req.body.password, 10); // hashes AND salts the password 10 times
        // password: req.body.password This would be very very bad !!!! We cannot save the unencrypted/unhashed password. We need a package bcrypt
        const user = new UserModel({ email: req.body.email, password: passwordHash });
        const result = await user.save();
        return resp.status(201).json({message: "User created", result});
    } catch(error) {
        return resp.status(500).json({error});
    }
});

// Validate credentials and if valid, generate and send the token
router.post("/login", async(request, response, next) => {
    try {
        // 1. Validate credentials by checking if email (username) exists. If true, check the password
        const user = await UserModel.findOne({email: request.body.email});
        if (!user) {
            return response.status(401).json({ message: 'Auth failed. Inexistent user' });
        }
        // user exists so now we can verify the password with the hashed from DB
        let passwordMatches = await bcrypt.compare(request.body.password, user.password);
        if (!passwordMatches) {
            return response.status(401).json({ message: 'Auth failed. Incorrect password' });
        }
        // user exists. Create and give him a JWT token.
        // jwt.sign (payload, secret, configuration (issueAt, expiresIn, etc)) sign the token with two random inputs as mail and id
        const token = jwt.sign({ email: user.email, userId: user._id },
                                'secret_should_be_longer',
                                { expiresIn: '1h'}
        );
        return response.status(200).json({token});
    } catch (error) {
        return response.status(500).json({error});
    }
});

module.exports = {
    router
}
