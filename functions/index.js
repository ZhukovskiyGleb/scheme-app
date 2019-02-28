const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

function setPartById(part, id) {
    admin.firestore().collection('parts').doc(id).set(
      part,
      {merge: true}
    );
  }

exports.addNewPart = functions.https.onCall((data, context) => {
    const part = data.part;

    return admin.firestore().collection('system').doc('counters').get()
    .then(
        counters => {
            const id = counters.data().parts;
            const total = id + 1;
            part.id = id;
            return admin.firestore().collection('system').doc('counters').set({
                parts: total
            }, {merge: true})
            .then(
                () => {
                    return admin.firestore().collection('parts').doc(id.toString()).set(part);
                }
            )
            .then(
                () => {
                    return {response: true,
                            totalParts: total}
                }
            )
            .catch(
                (reason) => {
                    return reason;
                }
            );
        }
    )
    .catch(
        (reason) => {
            return {
                response: false, 
                reason: reason || 'error'
            }
        }
    );
});