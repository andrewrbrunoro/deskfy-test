var nex;
var req;
var res;

const moment = require('moment');

class UploadRequest {

    error = [];

    setup = (request, response, next) => {

        this.error = [];

        req = request;
        res = response;
        nex = next;

        if (this.validateGifOrVideo()) {

            const video = req.files.video;
            if (video) {
                this.pipe('validateTimeInterval');
            }

            this.pipe('validateName');
            this.pipe('validateDate');
            this.pipe('validateShare');

            if (this.error.length === 0)
                next();
            else
                res.status(401).json({
                    validate: this.error
                });
        }
    };

    pipe = (callable) => {
        if (typeof this[callable] === 'function') {
            const result = this[callable]();
            if (result !== true) {
                this.error.push(result);
            }
        } else {
            res.status(400).json({
                message: `${callable} não é uma função.`
            });
        }
    };

    validateStart() {

        const value   = req.body.start;
        const isValid = moment(value, 'HH:mm:ss.SSS', true);

        if (!isValid.isValid())
            return { field: 'start', message: "Formato da começo inválido, formato: HHmm:ss.SSS" };

        return true;
    }

    validateDuration() {

        const value   = req.body.duration;
        const isValid = moment(value, 'HH:mm:ss.SSS', true);

        if (!isValid.isValid())
            return { field: 'duration', message: "Formato da duração inválido, formato: HHmm:ss.SSS" };

        if (isValid.format('HH:mm:ss.SSS') === "00:00:00.000")
            return { field: 'duration', message: "A Duração tem que ser maior que 00:00:00.000" };

        return true;
    }

    validateTimeInterval = () => {

        const startValidate = this.pipe('validateStart');
        const durationValidate = this.pipe('validateDuration');

        if (startValidate && durationValidate) {

            const start    = moment(req.body.start, 'HH:mm:ss.SSS');
            const duration = moment(req.body.duration, 'HH:mm:ss.SSS');
            const diffMil  = start.diff(duration, 'milliseconds');
            const diffSec  = start.diff(duration, 'seconds');

            if (diffSec > 0 && diffSec <= 15) {
                return true;
            } else {
                if (diffMil > 0) {
                    return true;
                } else {
                    return {field: 'duration', message: "O Tempo minímo é maior que 0sg e menor que 15sgs"};
                }
            }
        }

        return true;
    };

    validateDate () {

        const value   = req.body.date;
        const isValid = moment(value, 'YYYY-MM-DD HH:mm', true);
        const today   = moment();
        const diff    = isValid.diff(today, 'days');

        if (!isValid.isValid())
            return { field: 'date', message: "Data inválida, formato: YYYY-MM-DD HH:mm" };
        if (diff < 0)
            return { field: 'date', message: "A data para expirar tem que ser maior ou igual a de hoje." };

        return true;
    }

    validateName() {

        const value = req.body.name;

        if (value === "" || typeof value === "undefined" || value.length < 1)
            return { field: 'name', message: "Nome obrigatório" };

        return true;
    }

    validateShare () {

        const value = req.body.share;

        if (value !== "0" && value !== "1")
            return { field: 'share', message: "Esse GIF será público ou privado? Utilize: 0 ou 1" };

        return true;
    }


    validateGifOrVideo () {

        const { video, gif } = req.files;

        if (!video && !gif) {
            res.status(400).json({
                validate: [
                    {
                        field: 'upload',
                        message: 'Um vídeo ou um GIF é obrigatório.'
                    }
                ]
            });
            return false;
        }
        return true;
    }

}

module.exports = UploadRequest;
