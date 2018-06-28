'use strict'

var express = require('express');
var AlbumController = require('../controladores/album')
var auth = require('../middlewares/auth')
var multipart = require('connect-multiparty')

var api = express.Router();
var upload = multipart({ uploadDir: './uploads/albums'})

api.get('/album/:id', auth.ensureAuth, AlbumController.getAlbum)
api.post('/album', auth.ensureAuth, AlbumController.saveAlbum)
api.get('/albums/:id?', auth.ensureAuth, AlbumController.getAll)
api.put('/album/:id', auth.ensureAuth, AlbumController.updateAlbum)
api.delete('/album/:id', auth.ensureAuth, AlbumController.deleteAlbum)
api.post('/upload-album-image/:id', auth.ensureAuth,upload, AlbumController.uploadImage)
api.get('/get-album-image/:imageFile', AlbumController.getImageFile)




module.exports = api;
