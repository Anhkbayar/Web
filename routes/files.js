const express = require('express');
const router = express.Router();
const Filemodel = require('../models/filemodel');
const path = require('path')
const multer = require('multer')


const uploadPath = path.join('public', Filemodel.coverImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})

router.get('/adminHome', (req, res) => {
    res.render('admin/adminHome.ejs')
})
// Route to display all files
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
// Route to add a new "file" entry
router.post('/addFile', upload.array('photos', 4), async (req, res) => {
    const { title, description,price, link, printTime, material, glue, pieces, weight } = req.body;
    const fileNames = req.files ? req.files.map(file => file.filename) : [];
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
            coverImageNames: fileNames
        });
        console.log(newFile)
        res.redirect('/allFiles');
    } catch (error) {
        res.status(500).json({ error: "Error saving file data" });
    }
});

module.exports = router;
