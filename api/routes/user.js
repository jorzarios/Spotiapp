'use strict'

var express = require('express');
var UserController = require('../controladores/user');
var auth = require('../middlewares/auth');
var multipart = require('connect-multiparty')


var api = express.Router();
var upload = multipart({ uploadDir: './uploads/users'})


api.get('/probando-controlador', auth.ensureAuth, UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.userLogin);
api.put('/update/:id', auth.ensureAuth, UserController.updateUser);
api.post('/update-image-user/:id', auth.ensureAuth,upload, UserController.uploadImage);
api.get('/get-image-file/:imageFile', UserController.getImageFile);

module.exports = api;
