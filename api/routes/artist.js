'use strict'

var express = require('express');
var ArtistController = require('../controladores/artist')
var auth = require('../middlewares/auth')
var multipart = require('connect-multiparty')

var api = express.Router();
var upload = multipart({ uploadDir: './uploads/artists'})

api.get('/artist/:id', auth.ensureAuth, ArtistController.getArtist)
api.post('/artist', auth.ensureAuth, ArtistController.saveArtist)
api.get('/artists/:page?', auth.ensureAuth, ArtistController.getAll)
api.put('/artists/:id', auth.ensureAuth, ArtistController.updateArtist)
api.delete('/artists/:id', auth.ensureAuth, ArtistController.deleteArtist)
api.post('/upload-artist-image/:id', auth.ensureAuth,upload, ArtistController.uploadImage)
api.get('/get-artist-image/:imageFile', ArtistController.getImageFile)




module.exports = api;
