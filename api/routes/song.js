'use strict'

var express = require('express');
var SongController = require('../controladores/song')
var auth = require('../middlewares/auth')
var multipart = require('connect-multiparty')

var api = express.Router();
var upload = multipart({ uploadDir: './uploads/songs'})

api.get('/song/:id', auth.ensureAuth, SongController.getSong)
api.post('/song', auth.ensureAuth, SongController.saveSong)
api.get('/songs/:id?', auth.ensureAuth, SongController.getAll)
api.put('/song/:id', auth.ensureAuth, SongController.updateSong)
api.delete('/song/:id', auth.ensureAuth, SongController.deleteSong)
api.post('/upload-song-image/:id', auth.ensureAuth,upload, SongController.uploadFile)
api.get('/get-song-image/:songFile', SongController.getFile)




module.exports = api;
