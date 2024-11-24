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

const upload = multer({
    limits: { fileSize: 40 * 1024 * 1024 }, 
    fileFilter: (req, file, callback) => {
        const mimeTypes = {
            photos: imageMimeTypes,
            carfiles: stlMimeTypes,
            chassispic: imageMimeTypes,
        };
        const allowedTypes = mimeTypes[file.fieldname] || [];
        callback(null, allowedTypes.includes(file.mimetype));
    },
    storage: multer.diskStorage({
        destination: (req, file, callback) => {
            const destinations = {
                photos: uploadPath,
                carfiles: stlUploadPath,
                chassispic: chassisUploadPath,
            };
            callback(null, destinations[file.fieldname] || 'uploads/');
        },
        filename: (req, file, callback) => {
            callback(null, `${Date.now()}-${file.originalname}`);
        },
    }),
});

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

router.post('/addFile', upload.fields([
    { name: 'photos', maxCount: 4 },
    { name: 'carfiles', maxCount: 50 },
    { name: 'chassispic', maxCount: 2 },
]), async (req, res) => {
    console.log("Files uploaded:", req.files); // Log uploaded files
    console.log("Request body:", req.body); // Log form data

    const { title, description, price, link, printTime, material, glue, pieces, weight } = req.body;

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
