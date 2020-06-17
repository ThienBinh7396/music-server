const express = require('express');
const router = express.Router();

var fs = require('fs');

const ufCtrl = require('../server/controllers/UploadFileController.js')


router.post('/uploadImage', ufCtrl.uploadImage.bind(ufCtrl));
router.get('/test', (req, res) => {
    res.render('../views/index.ejs')
});

router.post('/test', (req, res) => {
    res.send('xxx');

});

const axios = require('axios');

async function readFile(path) {
    return new Promise(res => {
        fs.readFile(path, (err, data) => {
            if (err) {
                res(null);
            } else {
                res(data);
            }
        })


    })

}


router.post('/main/uploadFile', (req, res) => {
    console.log(__dirname + "/../public/uploads/admin/");


    fs.writeFile(__dirname + "/../public/uploads/admin/" + req.body.files.name, req.body.files.fileData, (err) => {
        console.log(err);
        return res.send(`https://my-music-serve.herokuapp.com/uploads/admin/${req.body.files.name}`)
    })


})

const admin = require("firebase-admin");

const bucket = admin.storage().bucket();

const config = {
    action: 'read',
    expires: '03-07-2065'
};

router.post('/test/uploadFile', async(req, res) => {
    console.log(req.files.file);


    let bucketFile = bucket.file(req.files.file.name);

    fs.createReadStream(req.files.file.tempFilePath)
        .pipe(bucketFile.createWriteStream({
            metadata: {
                contentType: req.files.file.mimetype,
            }
        }))
        .on('error', function(err) {
            res.send(err);
        })
        .on('finish', function(rs) {
            bucketFile.getSignedUrl(config, (err, url) => {

                if (err) {
                    res.send(err);
                } else {
                    res.send(url);
                }

            })

        });


})


module.exports = router;