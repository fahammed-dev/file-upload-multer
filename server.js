const express = require('express');
const multer = require('multer');

// file upload folder
const UPLOAD_FOLDER = './uploads/';

// define the storage
const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, UPLOAD_FOLDER);
    },
    filename: (req, res, cb)=>{
        // Important File.pdf => important-file-32drewr.pdf
        const fileExt = path.extname(file.originalname);
        const fileName = file.originalname
                            .replace(fileExt, '')
                            .toLowerCase()
                            .split(' ')
                            .join('_') + '_' + Date.now();
        cb(null, fileName + fileExt);
    },
})

// prepare the final multer object
const upload = multer(
    // dest: UPLOAD_FOLDER,
    storage: storage,
    limits: {
        fileSize: 1000000, // 1 MB
    },
    fileFilter: (req, file, cb) => {
        if (file.fieldname === 'avatar') {
            if(
                file.mimetype === 'image/png' || 
                file.mimetype === 'image/jpg' || 
                file.mimetype === 'image/jpeg'
                ) {
                cb(null, true); // null = error, true = allow
            }else {
                cb(new Error('Only .jpg, .png or .jpeg format allowed!'));
            }
        } else if(file.fieldname === 'doc') {
            if(file.mimetype === 'application/pdf') {
                cb(null, true);
            } else {
                cb (new Error('Only .pdf format allowed!'))
            }
        }else {
            cb(new Error('There wa an unknown error!'))
        }
    }
);

const app = express();

app.post('/', upload.fields([
    {name: 'avatar', maxCount: 1},
    {name: 'doc', maxCount: 1}
], (req, res) => {
    console.log(req.files);
});

// default error handler
app.use((err, req, res, next)=>{
    if(err) {
        if(err instanceof multer.MulterError) {
            res.status(500).send('There was an upload error!')
        }else {
            res.status(500).send(err.message);
        }
    }else {
        res.send('Success')
    }
});

app.listen(3000, () => {
  console.log('app listening at port 3000');
});
