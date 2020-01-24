
var env = process.env;

/**
 * Define o ID do PIPELINE ( Elastic Transcoder )
 *
 * @type {string}
 */
var pipelineId = env.PIPELINE_ID;

/**
 * Pasta ao qual será direcionado os arquivos convertidos
 * Pode preencher com vazio para fica na raíz do Bucket s3
 *
 * @type {string}
 */
var prefix = env.OUTPUT_KEY_PREFIX;

/**
 * Pasta ao qual será feita a escuta
 * @type {string}
 */
var copyright = env.COPYRIGHT;

var AWS = require('aws-sdk');
var transcoder = new AWS.ElasticTranscoder({
    apiVersion: '2012-09-25',
    region: env.REGION
});
var s3 = new AWS.S3();

console.log('=> v3');

module.exports.handler = (event, context, callback) => {

    console.log('=> Start Lambda');

    var srcKey        = unescape(event.Records[0].s3.object.key);
    var srcEtag       = unescape(event.Records[0].s3.object.eTag);
    var scrUploadTime = unescape(event.Records[0].eventTime);
    var bucket        = unescape(event.Records[0].s3.bucket.name);
    var S3Data        = {};

    new Promise((resolve, reject) => {

        s3.headObject({
            Bucket: bucket,
            Key: srcKey
        }, function(err, data) {

            console.log('=> S3 HeadObject: ', data);

            if (err)
                reject(err);
            else (data)
            resolve(data);
        });

    }).then(res => {

        console.log('=> S3 Data: ', res);

        var fileName = srcKey;
        var baseName = getOutputName(fileName);
        var MetaData = res.Metadata;

        var start    = MetaData.start;
        var duration = MetaData.duration;

        console.log('=> MetaData: ', MetaData);

        var params = {
            PipelineId: pipelineId,
            OutputKeyPrefix: prefix + '/',
            Input: {
                Key: fileName,
                FrameRate: 'auto',
                Resolution: 'auto',
                AspectRatio: 'auto',
                Interlaced: 'auto',
                Container: 'auto',
                TimeSpan:{
                    StartTime: start,
                    Duration: duration
                }
            },
            Outputs: [
                {
                    Key: baseName + '.gif',
                    ThumbnailPattern: '',
                    PresetId: '1351620000001-100200',
                    Watermarks: []
                }
            ]
        };

        console.log('=> Params Job: ', params);

        transcoder.createJob(params, function (err, data) {
            console.log('=> Start Transcoder');

            if (err) {
                console.log('=> an error occurred when transcode: ', fileName)
                callback(err);
            } else {
                callback(null, 'success');
            }
        });
    })
        .catch(err => {
            callback(err);
        });

};

function getOutputName(fileName) {
    let baseName = fileName.replace('inputs/', '');
    return removeExtension(baseName);
}

function removeExtension(filename) {
    let lastDotPosition = filename.lastIndexOf(".");
    if (lastDotPosition === -1) return filename;
    else return filename.substr(0, lastDotPosition);
}
