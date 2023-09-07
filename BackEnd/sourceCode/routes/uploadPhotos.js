const UserModel = require('../models/user.model')
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { registerValidation, loginValidation } = require('../validation')
const download = require('image-downloader')
const path = require('path')
const {S3Client, PutObjectCommand} = require('@aws-sdk/client-s3')
const multer = require('multer')
const fs = require('fs')
const mongoose = require('mongoose')
const mimetypes = require('mime-types')
const router = express.Router()

//Save photo to server using link
router.post('/upload-using-link', async (req, res) => {
    mongoose.set('strictQuery', false);
    mongoose.connect(process.env.DB_CONNECT);
    const {link} = req.body;
    const photoName = "photo" + Date.now() + ".jpg";

    try {
        const correctPath = path.normalize(`${__dirname}/uploads/${photoName}`);
        options = {
            url: link,
            dest: '/tmp/' + photoName,
        };
        await download.image(options);

        const url = await uploadToS3('/tmp/' + photoName, photoName, mimetypes.lookup('/tmp/' + photoName));

        res.json(url);
    } catch(err) {
        res.status(400).send(err);
    }
})

const photosMiddleware = multer({dest: '/tmp'});
router.post('/upload-photos', photosMiddleware.array('photos', 50), async (req, res) => {
    mongoose.set('strictQuery', false);
    mongoose.connect(process.env.DB_CONNECT);
    const uploadedFiles = [];

    for (let i = 0; i < req.files.length; i++) {
        //uploaded files don't have extension saved on the server, manually add it
        const {path, originalname, mimetype} = req.files[i];
        
        uploadedFiles.push(await uploadToS3(path, originalname, mimetype));
    }
    res.json(uploadedFiles);
})

const uploadToS3 = async (path, originalFilename, mimetype) => {
    const client = new S3Client({
        region: 'eu-north-1',
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
        }
    });
    const fileNameParts = originalFilename.split('.');
    const extension = fileNameParts[fileNameParts.length - 1];
    const newFileName = Date.now() + '.' + extension;

    try {
        const data = await client.send(new PutObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Body: fs.readFileSync(path),
            Key: newFileName,
            ContentType: mimetype,
            ACL: 'public-read'
        }))
    } catch(err) {
        throw err;
    }

    return `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/${newFileName}`;
    
}

module.exports = router