const Pusher = require('pusher');

/**
 * @author Andrew R Brunoro
 * @description Os códigos inseridos para a instância do Pusher está válido até dia 29
 * @version r0.0.1
 */
class PusherUtil {

    _pusher = null;

    constructor() {
        this._pusher = new Pusher({
            appId: '936542',
            key: 'a1d0775cbf2fa5a96a88',
            secret: '2352aad62dee4812d61c',
            cluster: 'mt1',
            encrypted: true
        });
    }

    get pusher () {
        return this._pusher;
    }

    notify (channel, event, data) {
        this.pusher.trigger(channel, event, data);
    }
}

module.exports = PusherUtil;
