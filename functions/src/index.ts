import * as admin from "firebase-admin";
import { DocumentSnapshot, getFirestore } from 'firebase-admin/firestore';
import * as functions from "firebase-functions";
import { QueryDocumentSnapshot } from "firebase-functions/v1/firestore";
import { Order } from "./models/Order";
import { User } from "./models/User";

const params = {
    type: "service_account",
    projectId: "localleaf-1a9ea",
    privateKeyId: "2fad86da15b83ef820a370e6c70d4a11e3d72bf4",
    privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCSSbRI5qHet+5o\nerJHiN7JZBysaNXtJjZqWTzmPixOb50I0Dn4enQ/3L5aoPZTBbqYNG6SKbJwYccp\nzdOID78zcUGRlGuNl5E83hDKfP+wDh69+sbE7BMw+L3C7mZZKCfcAxx79Pk8RoLS\nRrLwLj8FjHp9tOWrpRPTYTEHC+WrZ28wVhO0QhbqeKLWfWQdxvsN6kR5QT4FIUE6\nSUz4NVm5Aw4nfRlRqV/jrEJdVu1SHBGTkHlhXv/ScE6xU3044unbCwWM2Tlv23zT\n6mOxPQMTssMbAcLRCcKqFyTSxpMf38kyVZehllZ1QyL2ZlxU8vLiVVbZlamtxN7S\nK9zUaz19AgMBAAECggEAQ00jY1Kv7+5BAdJJCP4gORkU1AEbQpKNAFpz2R2Ldr6E\nyZQ6x2VW7DabYMii6sk88l9U62vBi1CAt2vZQMS1223kk5xr6uVrTUyA/xeI7q9g\nV1jzb4+IuMQHUZIqhiQiSmcoCKNIswFhmGosUrGEDwJ1LDY4X8J/n4UccDh5/mPS\ncCg1/KDQ98/8VZ7EXwKWWA1LIFoSrB2cgAMgLo+/5XkUe8AcOrIOW/V4NyDYowo6\nOc3KgdLZs6zLbZ8hnMy6ghJOQxR0+EaWcvkji9JVL06uX/LrhKh13+J5sh3H+Wyz\nLV8c1cnUFw/E5YuAhQZQu5PeH7hPxb9M+Qs1jDF+xQKBgQDNpHghXGDoih3wq8Y8\n/dDo9glH3repLF4EbEZSe8j4dVy8QE4Hl19ta5yuhmWNy7copzxwFr7ReqE0QIcL\ngUzUTggehIQ+9i+cm107+p5DuiDsDhhDzZvO22D3siSikWyI+uj1rO8jDER9BURG\nKqjfzNVAqfKQUbGtLlGBVZXQGwKBgQC2HFq9f8l+7gmKpX9CYa3FLhW4ZtYkFN18\nNzjIH1madHzgsN1OEm+RikqnUgn9R/94blPhfaje9b8zE6kWXgzOO0P0YGG/c28/\nMSSBDUAt26nsDQLwQY4tm8g0k8LSr02XBhVBD9Nt63ZiCjpcU7dknr7pP7TDiUUR\n7uiF77/yRwKBgDA7/6FzlZd1rgghgmIT9shtzUd6SgH4UiUfcG8wcbc1cAcH3kWR\nj+SOdTXKeE+GFPQIJfj0nNVtuhoTeJmOPoMdunHOC2bpP8mv93J2GmEwa0BzHeXp\neD5Q3rG6qzUmfxqyH6pgYccKvZXFgnoiz3GPDgYY1rhbMR2524xGktk5AoGAQ14x\n4zBGpgIA3Z1jencQBYWK23CPf0GIvc7f3ohaaVz2ZViIRb1kMH7sJwGeWGguBasq\ntJv7wJ9AX/DB+FhKfHBILzsIbf6SBNp1GpiASXadYYlesOpPYmfipDCVPcND/L5v\nVmY4XM1iOdp2xHjjuwFOtpKumDdLqdqrggCzDTkCgYEAoSFwxFWc6ITWNEN1JCHD\nHw/q0TJoqU6v5Kr6KbwTlHTiXP2DMAB8lBjY735hpHoAsw4NyvZ14KIWTqBGI0Rc\nGEauazc5PMILFCiPubUNcwfKzw9bYdxHVLbs+yEWw+iRgFBIZmSrw51iwkLcdNG3\nOhkuH8nR4BOIu5Cr3HIpCs4=\n-----END PRIVATE KEY-----\n",
    clientEmail: "firebase-adminsdk-zzq8l@localleaf-1a9ea.iam.gserviceaccount.com",
    clientId: "111656634143119423337",
    authUri: "https://accounts.google.com/o/oauth2/auth",
    tokenUri: "https://oauth2.googleapis.com/token",
    authProviderX509CertUrl: "https://www.googleapis.com/oauth2/v1/certs",
    clientC509CertUrl: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-zzq8l%40localleaf-1a9ea.iam.gserviceaccount.com",
    universe_domain: "googleapis.com"
};

admin.initializeApp({
    credential: admin.credential.cert(params)
});

exports.notifyAssigningEmployees = functions.firestore.document("orders/{orderId}").onUpdate(async (change: functions.Change<QueryDocumentSnapshot>, context: functions.EventContext) => {
    const db = getFirestore();
    let changedSnapshot = change.after;
    let orderData: Order = changedSnapshot.data() as Order;
    let usersSnapshotPromise: Promise<DocumentSnapshot>[] = [];
    for(let i = 0; i < orderData.assigned.length; i++) {
        let uid = orderData.assigned[i];
        let userPromise = db.doc("users/" + uid).get();
        usersSnapshotPromise.push(userPromise);
    }
    let snapshots: DocumentSnapshot[] = await Promise.all(usersSnapshotPromise);
    let tokens: string[] = [];
    const payload = {
        notification: {
            title: `Message`,
            body: "New Work Assgined To you",
            click_action: 'FCM_PLUGIN_ACTIVITY',
        }
    };
    snapshots.forEach((s) => {
        let user = {...s.data(), id: s.id} as User;
        if(user.messagingToken) {
            tokens.push(user.messagingToken);
        }
    });
    functions.logger.log("FCM Tokens: ", tokens);
    try {
        const response = await admin.messaging().sendToDevice(tokens, payload);
        functions.logger.log('Notifications have been sent successfully!', response);
    } catch(err) {
        console.error(err);
        functions.logger.log('Error on sending notification!', err);
    }
})

// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
