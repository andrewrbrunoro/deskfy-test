exports.default = function (app) {
    app.get('/', function (request, response) {
        response.send('Hello World!');
    });
};
