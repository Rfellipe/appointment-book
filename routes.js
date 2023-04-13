const express = require('express');
const route = express.Router();

const indexController = require('./src/controllers/indexController');
const loginController = require('./src/controllers/loginController');
const contactsController = require('./src/controllers/contactsController');

const { loginRequired } = require('./src/middlewares/middleware');

// HOME ROUTES
route.get('/', indexController.index);

// LOGIN ROUTES
route.get('/login', loginController.index);
route.post('/login/register', loginController.register)
route.post('/login/login', loginController.login);
route.get('/login/logout', loginController.logout);

// CONTACTS ROUTES
route.get('/contacts', loginRequired, contactsController.index);
route.post('/contacts/register', loginRequired, contactsController.register);
route.get('/contacts/:id', loginRequired, contactsController.editIndex);
route.post('/contacts/edit/:id', loginRequired, contactsController.edit);
route.get('/contacts/delete/:id', loginRequired, contactsController.delete);



module.exports = route;
