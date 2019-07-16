const jwt = require('jsonwebtoken');

const { UserModel } = require('../models/user');

var checkAuth = async(request, response, next) => {
    // you can store the token into req. params but it's better in the headers
    // many API put "Beader token_asas_asas so we need to split it
    try {
        const token = request.headers.authorization.split(' ')[1];
        // jwt takes token and the secret string that we used to generate the token
        jwt.verify(token, 'secret_should_be_longer');
        next();
    } catch(error) {
        response.status(401).json({message: 'Faied Authentication. Missing token'});
    }
};

module.exports = {
    checkAuth
}
