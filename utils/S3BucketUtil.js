const AWS  = require('../config/aws');
const fs   = require('fs');
const path = require('path');

/**
 * @author Andrew R Brunoro
 * @description Classe criada com utilidade apenas para teste
 * @version r0.0.1
 */
class S3BucketUtil {

    _s3 = new AWS.S3();
    _bucket = null;
    _fs = null;
    _file = null;
    _metaData = {};

    /**
     *
     * @param bucket
     */
    constructor(bucket) {
        this.bucket = bucket;
    }

    get s3 () {
        return this._s3;
    }

    /**
     * Definição do AWS S3 Bucket que vai receber os arquivos
     *
     * @param bucket
     */
    set bucket (bucket) {
        this._bucket = bucket;
    }

    get bucket () {
        return this._bucket;
    }

    /**
     * Localização do arquivo
     *
     * @param file
     */
    set file (file) {
        this._file = file;
    }

    get file () {
        return this._file;
    }

    get output () {
        return {
            Bucket: this.bucket,
            Body: fs.createReadStream(this.file),
            Key: path.basename(this.file),
            ACL: 'public-read',
            Metadata: this.metaData
        };
    }

    addMetaData (key, value) {
        this._metaData[key] = value;
        return this;
    }

    get metaData () {
        return this._metaData;
    }

    /**
     * Upload do arquivo para o S3
     *
     * @returns {Promise<unknown>}
     */
    upload (fileName = "") {

        if (!!fileName) this.file = fileName;

        return new Promise((resolve, reject) => {
            this.s3.upload(this.output, function (error, data) {
                if (error)
                    reject(error);
                if (data) {
                    resolve(data);
                }
            });
        });
    }

    /**
     * TDD
     */
    testSend () {
        this.file = "tests/files/test.txt";

        return new Promise((resolve, reject) => {
            this.upload().then((res) => {
                resolve(res);
            }).catch(err => {
                reject(err);
            })
        });
    }

}

module.exports = S3BucketUtil;
