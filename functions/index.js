const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

const cors = require('cors');

exports.addMessage = functions.https.onRequest((req, res) => {
    cors(request, response, () => {
        response.status(500).send({test: 'Testing functions'});
    });
});