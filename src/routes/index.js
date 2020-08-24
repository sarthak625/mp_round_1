const express = require('express');
const logger = require('log4js').getLogger('default');

const controller = require('./controller');
const routesUtility = require('../lib/routesUtil');

const schemaUtility = require('../lib/schema');

const { errors, success } = routesUtility;

const router = new express.Router();

router.post('/login', async (req, res) => {
  try {
    await schemaUtility.validateJoi(req.body, schemaUtility.loginSchema);
    const { username, password } = req.body;
    const token = await controller.createLoginToken(username, password);
    const result = success.success('OK', { token });
    res.status(result.statusCode).send(result);
  } catch (err) {
    const error = routesUtility.errorHandler(err);
    res.status(error.statusCode).send(error);
  }
});

router.post('/user-control/create', routesUtility.authenticate, async (req, res) => {
  try {
    await schemaUtility.validateJoi(req.body, schemaUtility.userSchema);
    const user = await controller.createUser(req.body);
    const result = success.success('OK', { user });
    res.status(result.statusCode).send(result);
  } catch (err) {
    const error = routesUtility.errorHandler(err);
    res.status(error.statusCode).send(error);
  }
});

router.post('/user-control/validate', async (req, res) => {
  try {
    await schemaUtility.validateJoi(req.body, schemaUtility.validateSchema);
    await controller.validateUser(req.body);
    const result = success.success('OK');
    res.status(result.statusCode).send(result);
  } catch (err) {
    const error = routesUtility.errorHandler(err);
    res.status(error.statusCode).send(error);
  }
});

router.get('/user-control/item', routesUtility.authenticate, async (req, res) => {
  try {
    await schemaUtility.validateJoi(req.query, schemaUtility.itemIdSchema);
    const item = await controller.getItem(req.query.id);
    const result = success.success('OK', { item });
    res.status(result.statusCode).send(result);
  } catch (err) {
    const error = routesUtility.errorHandler(err);
    res.status(error.statusCode).send(error);
  }
});

router.get('/user-control/order', routesUtility.authenticate, async (req, res) => {
  try {
    await schemaUtility.validateJoi(req.query, schemaUtility.itemIdSchema);
    const item = await controller.getOrderInformation(req.query.id);
    const result = success.success('OK', { item });
    res.status(result.statusCode).send(result);
  } catch (err) {
    const error = routesUtility.errorHandler(err);
    res.status(error.statusCode).send(error);
  }
});

router.post('/google-login', routesUtility.authenticate, async (req, res) => {
  try {
    await schemaUtility.validateJoi(req.body, schemaUtility.googleLoginSchema);
    const { email, token } = req.body;
    const item = await controller.loginWithGoogle(email, token);
    const result = success.success('OK', { item });
    res.status(result.statusCode).send(result);
  } catch (err) {
    const error = routesUtility.errorHandler(err);
    res.status(error.statusCode).send(error);
  }
});

module.exports = router;
