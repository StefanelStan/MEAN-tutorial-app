const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const postsRoutes = require('./routes/posts').router;
const userRoutes = require('./routes/user').router;

const app = express();

mongoose.connect("mongodb+srv://stefanmeanmongorw:" + process.env.ATLAS_PWD + "@cluster0-czxby.mongodb.net/node-angular?retryWrites=true&w=majority")
    .then(() => {
        console.log('Connected to MongoDB Cluster');
    })
    .catch((error) => {
        console.log('Connection failes due to ' + error.message);
    });

app.use(bodyParser.json());
// will forward all /images req to backend/images. We indicate this folder with path package of express
app.use("/images", express.static(path.join("images")));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); //allow CORS
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Request-With, Content-Type, Accept, Authorization'); //tell which extra headers the app might have
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    console.log('Middleware');
    next();
});

app.use('/api/posts', postsRoutes);
app.use('/api/user', userRoutes);

module.exports = {
    app
}
