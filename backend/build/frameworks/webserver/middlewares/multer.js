"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
mport;
Multer, { FileFilterCallback };
from;
'multer';
const storage = Multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const fileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Please upload only images.'));
    }
    cb(null, true);
};
const uploadToMulter = Multer({
    storage,
    fileFilter,
});
exports.default = uploadToMulter;
