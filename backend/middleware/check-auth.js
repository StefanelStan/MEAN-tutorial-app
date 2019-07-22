const jwt = require('jsonwebtoken');

const { UserModel } = require('../models/user');

var checkAuth = async(request, response, next) => {
    // you can store the token into req. params but it's better in the headers
    // many API put "Bearer token_asas_asas" so we need to split it
    try {
        const encodedToken = request.headers.authorization.split(' ')[1]; // Bearer token
        // jwt takes token and the secret string that we used to generate the token
        const decodedToken = jwt.verify(encodedToken, process.env.JWT_KEY);
        // Express will add the fields to request where they will be accessible from anywhere next() goes
        request.userData = { email: decodedToken.email, userId: decodedToken.userId };
        next();
    } catch(error) {
        response.status(401).json({message: 'Faied Authentication. Missing token'});
    }
};

module.exports = {
    checkAuth
}
