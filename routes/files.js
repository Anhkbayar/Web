const express = require('express');
const router = express.Router();
const Filemodel = require('../models/filemodel');
const path = require('path')
const multer = require('multer')


const uploadPath = path.join('public', Filemodel.coverImageBasePath);
const stlUploadPath = path.join('public', Filemodel.stlFileBasePath);
const chassisUploadPath = path.join('public', Filemodel.chassisImageBasePath);

const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
const stlMimeTypes = ['application/sla']

const uploadImage = multer({
    dest: uploadPath,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})

const stlUpload = multer({
    dest: stlUploadPath,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB per STL file
    },
    fileFilter: (req, file, callback) =>{
        callback(null, stlMimeTypes.includes(file.mimetype))
    }
}) 

const chassisUpload = multer({
    dest: chassisUploadPath,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB per chassis image
    },
    fileFilter: (req, file, callback)=>{
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})

const uploadFile = multer();

router.get('/adminHome', (req, res) => {
    res.render('admin/adminHome.ejs')
})
// Buh filuudiig haruuldag
router.get('/allFiles', async (req, res) => {
    try {
        const allFiles = await Filemodel.find();
        res.render('admin/allFiles.ejs', { allFiles, error: null });
    } catch (error) {
        res.render('admin/allFiles.ejs', { allFiles: [], error: "Error retrieving files" });
    }
});

router.get('/addFile', async (req, res) => {
    await res.render('admin/addFile.ejs')
})
// Shine file nemdeg shi
router.post('/addFile', uploadFile.fields([
    {name: 'photos', maxCount: 4},
    {name: 'files', maxCount: 50},
    {name: 'chassispic', maxCount:2}
]), async (req, res) => {

    const { title, description,price, link, printTime, material, glue, pieces, weight } = req.body;

    const photoFileName = req.files.photos ? req.files.photos.map(file => file.filename) : [];
    const stlFileName = req.files.carfiles ? req.files.carfiles.map(file => file.filename) : [];
    const chassisFileName = req.files.chassispic ? req.files.chassispic.map(file => file.filename) : [];

    try {
        const newFile = await Filemodel.create({
            title,
            description,
            price,
            link,
            printTime,
            material,
            glue: glue === 'on',
            pieces,
            weight,
            coverImageNames: photoFileName,
            stlFileNames: stlFileName,
            chassisImageNames: chassisFileName,
        });
        console.log(newFile)
        res.redirect('/allFiles');
    } catch (error) {
        res.status(500).json({ error: "Error saving file data" });
    }
});

module.exports = router;
