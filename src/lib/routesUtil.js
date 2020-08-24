const logger = require('log4js').getLogger('debug');
const authUtility = require('./auth');

const success = {
  success: (message, body) => {
    const params = {
      statusCode: 200,
      message: message || 'RESPONSE_SUCCESS',
    };

    if (body) {
      params.body = body;
    } else {
      params.body = {};
    }

    return params;
  },

  conflict: (message, body) => {
    const params = {
      statusCode: 209,
      message: message || 'RESPONSE_CONFLICT',
    };

    if (body) {
      params.body = body;
    } else {
      params.body = {};
    }

    return params;
  },
};

const errors = {
  badRequest: (message, error, extraParams) => {
    if (! error) error = [];

    const params = {
      statusCode: 400,
      message: message || 'RESPONSE_BAD_REQUEST',
      error,
      extraParams: extraParams,
    };

    return params;
  },

  forbidden: (message, error, extraParams) => {
    if (! error) error = [];
    const params = {
      statusCode: 403,
      message: message || 'RESPONSE_FORBIDDEN',
      error,
      extraParams,
    };


    return params;
  },

  notFound: (message, error, extraParams) => {
    if (! error) error = [];

    for (const i in error) {
      if (body.hasOwnProperty(i)) {
        params[i] = error[i];
      }
    }

    const params = {
      statusCode: 404,
      message: message || 'RESPONSE_NOT_FOUND',
      extraParams,
      error,
    };

    return params;
  },

  internalServerError: (message, error, extraParams) => {
    if (! error) error = [];

    const params = {
      statusCode: 500,
      message: message || 'RESPONSE_INTERNAL_SERVER_ERROR',
      error,
      extraParams,
    };
    return params;
  },

  failedDependency: (message, error, extraParams) => {
    if (! error) error = [];

    const params = {
      statusCode: 424,
      message: message || 'RESPONSE_FAILED_DEPENDENCY',
      error,
      extraParams,
    };

    return params;
  },

  customError: (error, fields) => {
    if (!error) error = errors.internalServerError();
    return {
      error: fields,
      errorCode: 'FAILED',
      message: 'RESPONSE_SOMETHING_WENT_WRONG',
      statusCode: error.statusCode,
    };
  },
};

/**
 * Error handler
 * @param {Object} err Object
 * @return {Object} Error response
 */
function errorHandler(err) {
  try {
    logger.debug(`Entered error handler`);
    // Check if it is a custom error, if so let it pass
    if (err && err.statusCode && err.message) {
      return err;
    } else {
      logger.error(err);
      // Else throw an internal server error
      return errors.internalServerError();
    }
  } catch (err) {
    throw err;
  }
}

/**
 * 
 * @param {Object} req Request
 * @param {Object} res Response
 * @param {Function} next Next handler
 */
async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
  
    if (authHeader) {
      const startsWithBearer1 = authHeader.startsWith('bearer ');
      const startsWithBearer2 = authHeader.startsWith('Bearer ');
  
      // Token object
      let token;
  
      // Remove bearer from the token
      if (startsWithBearer1 || startsWithBearer2) {
        token = authHeader.slice(7, authHeader.length);
      }
  
      const isValidToken = await authUtility.decodeTokenUsingJWT(
        token, process.env.JWT_SECRET,
      );
  
      if (!isValidToken) return res.send('FORBIDDEN');
  
      // Normally i would add the JWT data to the request object but that doesn't seem
      // of much use here, so skipping it
  
      next();
    } else {
      // Send unauthorized
      return res.send('UNAUTHORIZED');
    }
  } catch (err) {
    const error = errors.badRequest('MISSING_AUTH_HEADER');
    return res.status(error.statusCode).send(error);
  }
}

module.exports = {
  errors,
  success,
  errorHandler,
  authenticate,
};
