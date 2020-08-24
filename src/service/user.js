const {
  User,
} = require('../models/index');

/**
 * Create a user in DB
 * @param {Object} params 
 */
async function createUser(params) {
  return User.create(params);
}

/**
 * Get the user by email
 * @param {String} email 
 */
async function getUserByEmail(email) {
  return User.findOne({
    where: {
      email,
    },
  });
}

/**
 * Validate the user using email and password
 * @param {Object} params Params object
 */
async function validateUser(params) {
  const user = await getUserByEmail(params.email);
  const isValid = User.comparePassword(params.password, user.password);
  return isValid;
}

module.exports = {
  createUser,
  getUserByEmail,
  validateUser,
};
