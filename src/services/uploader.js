import multer from 'multer'
import __dirname from '../utils.js'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        if (file.fieldname === 'imageProfile') {
            cb(null, `${__dirname}/storage/uploads/profiles/`);
        } else if (file.fieldname === 'imageProduct') {
            cb(null, `${__dirname}/storage/uploads/products/`);
        } else if (file.fieldname === 'document') {
            cb(null, `${__dirname}/storage/uploads/documents/`);
        } else {
            cb(new Error('Tipo de archivo no válido'), null);
        }
    },
    filename: function (req, file, cb) {

        const userId = req.params.uid;

        cb(null, `${userId}-${file.originalname}`);
    },
});

const uploader = multer({ storage: storage });

export default uploader;