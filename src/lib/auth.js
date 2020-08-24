const JWT = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Sign JWT token using a secret along with some data
 * @param {Object} object Payload for JWT
 * @param {String} secret JWT secret
 * @param {Number} expiresIn Expiry time in ms
 * @return {String} JWT
 */
function createToken(object, secret, expiresIn) {
  if (!expiresIn) {
    return JWT.sign(object, secret, { algorithm: 'HS256', expiresIn: '18h' });
  } else {
    return JWT.sign(object, secret, { algorithm: 'HS256', expiresIn: expiresIn });
  }
}


/**
 * Decode the JWT using the secret
 * @param {String} token Token string
 * @param {String} secret Token secret
 * @return {Promise<String>} Decoded token
 */
function decodeTokenUsingJWT(token, secret) {
  return new Promise((resolve, reject) => {
    JWT.verify(token, secret, (err, decodedToken) => {
      if (err) reject(err);
      else resolve(decodedToken);
    });
  });
}

/**
 * Verify if the google token is valid
 * @param {*} token Access token
 */
async function isValidGoogleToken(token) {
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const userId = payload['sub'];
    if (userId) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
}

module.exports = {
  createToken,
  decodeTokenUsingJWT,
  isValidGoogleToken,
};
