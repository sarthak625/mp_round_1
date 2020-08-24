// Utilities
const authUtility = require('../lib/auth');
const { errors } = require('../lib/routesUtil');

// Services
const userService = require('../service/user');
const itemService = require('../service/item');

/**
 * Create a login token
 */

 /**
  * Create a login token if the username and the passwords match
  * @param {String} username Username
  * @param {String} password Password
  */
async function createLoginToken(username, password) {
  try {
  /**
     * If the static credentials match forward the password
     */
    const isValidUsername = username === process.env.STATIC_USERNAME;
    const isValidPassword = password === process.env.STATIC_PASSWORD;

    const isValidUser = isValidUsername && isValidPassword;

    if (!isValidUser) throw errors.badRequest('INVALID_CREDENTIALS');

    const token = authUtility.createToken({
      username,
    }, process.env.JWT_SECRET, '1d');
    return token;
  } catch (err) {
    throw err;
  }
}

/**
 * Create a user from the params
 * @param {Object} body Body
 * @return {Object} created user id
 */
async function createUser(body) {
  try {
    let user = await userService.createUser(body);
    user = user.toJSON();
    delete user.password;
    return user;
  } catch (err) {
    console.log(JSON.stringify({ err }, undefined, 2));
    if (err.name === 'SequelizeUniqueConstraintError') {
      const message = err.errors[0] ? err.errors[0].message : 'Duplicate entry';
      throw errors.badRequest(message);
    }
    throw err;
  }
}

/**
 * Validate a user using email and password
 * @param {Object} body Body
 */
async function validateUser(body) {
  try {
    const isValid = await userService.validateUser(body);
    if (!isValid) throw errors.badRequest('INVALID_EMAIL_OR_PASSWORD')
    return isValid;
  } catch (err) {
    throw err;
  }
}

/**
 * Get the item by id
 * @param {Number} id Item Id
 */
async function getItem(id) {
  try {
    const item = await itemService.getItem(id);
    if (!item) throw errors.notFound('ITEM_NOT_FOUND')
    return item;
  } catch (err) {
    throw err;
  }
}

/**
 * Get the item by id
 * @param {Number} id Id
 */
async function getOrderInformation(id) {
  try {
    const item = await itemService.getOrderInformation(id);
    if (!item) throw errors.notFound('ITEM_NOT_FOUND')
    return item;
  } catch (err) {
    throw err;
  }
}

/**
 * Get the item by id
 * @param {String} email Google mail
 * @param {String} googleToken token
 */
async function loginWithGoogle(email, googleToken) {
  try {
    const isValidToken = await authUtility.isValidGoogleToken(googleToken);
    // If not a valid token throw error
    if (!isValidToken) throw errors.badRequest('INVALID_GOOGLE_TOKEN');

    // Else get the user
    const user = await userService.getUserByEmail(email);

    if (!user) {
      // Then send forbidden
      throw errors.forbidden('USER_NOT_CREATED');
    }

    const token = authUtility.createToken({
      email,
    }, process.env.JWT_SECRET, '1d');

    return token;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  createLoginToken,
  createUser,
  validateUser,
  getItem,
  getOrderInformation,
  loginWithGoogle,
};
