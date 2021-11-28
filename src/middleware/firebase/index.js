const admin = require("firebase-admin");

const firebaseConfig = {
  type: process.env.FBCONFIG_TYPE,
  project_id: process.env.FBCONFIG_PROJECT_ID,
  private_key_id: process.env.FBCONFIG_PRIVATE_KEY_ID,
  private_key: process.env.FBCONFIG_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FBCONFIG_CLIENT_EMAIL,
  client_id: process.env.FBCONFIG_CLIENT_ID,
  auth_uri: process.env.FBCONFIG_AUTH_URI,
  token_uri: process.env.FBCONFIG_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FBCONFIG_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.FBCONFIG_CLIENT_CERT_URL,
  };
  

  module.exports = admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig),
    databaseURL: process.env.FB_DATABASE_URL
  });
  