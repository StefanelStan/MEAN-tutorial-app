const multer = require('multer');

const MIME_TYPE_MAP = {
    'image/png' : 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}

// confdigure the multer to use the destination and how to write the name of file
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const isValid = MIME_TYPE_MAP[file.mimetype]; // if file is invalid, this will be invalid/null and error will remain error
        let error = new Error("Invalid mime-type");
        if (isValid) { // if isValid was left null, error will not be set to null and callback will blow with error
            error = null;
        }
        callback(error, 'backend/images');
    },
    filename : (req, file, callback) => {
        const name = file.originalname.toLowerCase().split(' ').join('-'); // this will remove the extension
        const ext = MIME_TYPE_MAP[file.mimetype];
        console.log(name);
        callback(null, name + '-' + Date.now() + '.' + ext);
    }
});

module.exports = multer({storage: storage}).single("image");
