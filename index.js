const config  = require('./config/app').default;

const express = require('express');
const app     = express();

// -> Inicia as rotas
const path         = require('path');
const S3BucketUtil = require('./utils/S3BucketUtil');

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const name      = file.originalname;
        const fileName  = path.basename(name, path.extname(name));
        const storeName = `${fileName}-${file.fieldname}-${Date.now()}${path.extname(name)}`;
        cb(null, storeName);
    }
});


const upload = multer({
    storage
});

const formUpload = upload.fields([
    {name: 'video', maxCount: 1},
    {name: 'gif', maxCount: 1}
]);

const UploadRequest = require('./request/UploadRequest');

const { Gif } = require('./app/models');

app.post('/api/upload-video', [formUpload, new UploadRequest().setup], (request, response) => {

    const { video, gif } = request.files;
    const { start, duration, name, date, share } = request.body;

    const Bucket = new S3BucketUtil('prova-tecnica-deskfy-andrewrbrunoro');

    if (!!video) {

        Bucket.addMetaData('start', start)
            .addMetaData('duration', duration)
            .upload(video[0].path)
            .then(res => {

                Gif.create({
                    name: name,
                    date: date,
                    start: start,
                    duration: duration,
                    share: share,
                    video: path.basename(res.key, path.extname(res.key)),
                    gif: ""
                });

                response.status(200).json({
                    message: "Upload efetuado com sucesso, aguarde estamos convertendo seu vídeo para GIF."
                });
            })
            .catch(err => {
                response.status(400).json({
                    message: err
                });
            });
    } else {
        Bucket.upload(gif[0].path)
            .then(res => {

                Gif.create({
                    name: name,
                    date: date,
                    start: start,
                    duration: duration,
                    share: share,
                    video: path.basename(res.key, path.extname(res.key)),
                    gif: ""
                });

                response.status(200).json({
                    message: "O Upload foi efetuado com sucesso.",
                    result : res
                });
            })
            .catch(err => {
                response.status(400).json({
                    message: err
                });
            });
    }
});

app.get('/api/test-upload', function (request, response) {

    const Test = new S3BucketUtil('prova-tecnica-deskfy-andrewrbrunoro');

    Test.testSend().then(res => {
        response.status(200).json({
            result: res,
            message: 'Arquivo está sendo processado, aguarde...'
        });
    }).catch(err => {
        response.status(400).send({
            result: err,
            message: `Opa, não foi possível efetuar o upload, tente novamente.`
        });
    });
});
// -> Inicia as rotas

app.listen(config.port, function() {
    console.log(`Run in localhost:${config.port}`);
});
