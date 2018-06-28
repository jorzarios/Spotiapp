'use strict'

var path = require('path');
var fs = require('fs');

var paginate = require('mongoose-pagination')

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getSong(req, res) {

  var songId = req.params.id

  Song.findById(songId).populate({path: 'album'}).exec((err, song) => {
    if (err) {
      res.status(500).send({message: "Error en la peticion"})
    } else {
      if (!song) {
        res.status(404).send({message: "song no existe"})
      } else {
        res.status(200).send({song})
      }
    }
  })
}

function saveSong(req, res) {
      var song = new Song()
      var params = req.body

      song.number = params.number,
      song.name = params.name,
      song.duration = params.duration,
      song.file = null,
      song.album = params.album

      song.save((err, songStored) => {

        if (err) {
          res.status(500).send({message: "Error al guardar el song"})
        } else {
          if (!songStored) {
            res.status(404).send({message: "song no ha sido guardado"})
          } else {
            res.status(200).send({song: songStored})
          }
        }
      })
    }

function getAll(req, res) {
  var albumId = req.params._id;

  if(!albumId){
    var find = Song.find({}).sort('name')
  }else{

  var find = Song.find({album: albumId}).sort('name')
}

  find.populate({
    path: 'album',
    populate: {
      path: 'artist',
      model: 'Artist'
    }
  }).exec((err, songs) => {
    if(err) {
      res.status(500).send({message: 'Error de peticion'})
    } else {
        if(!songs){
          res.status(400).send({message: 'no hay songs'})
        }else {
          res.status(200).send({songs})
        }
    }
  })
}

function updateSong(req, res) {
      var songId = req.params.id;
      var update = req.body;

      Song.findByIdAndUpdate(songId, update, (err, songUpdated) => {
        if (err) {
          res.status(500).send({message: 'Error del servidor'});
        } else {
          if (!songUpdated) {
            res.status(404).send({message: 'Error al actualizar el lbuma'});
          } else {
            res.status(400).send({song: songUpdated});
          }
        }
      })
    }

function deleteSong(req, res) {
      var songId = req.params.id;

      Song.findByIdAndRemove(songId, (err, songRemoved) => {
        if (err) {
          res.status(500).send({message: 'Error del servidor'});
        } else {
          if (!songRemoved) {
            res.status(404).send({message: 'Error al eliminar al lbuma'});
          } else {
              res.status(200).send({songRemoved});
            }
          }
        })
      }

    function uploadFile(req, res) {
      var songId = req.params.id;
      var file_name = 'No subido...';

      if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split("/");
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if (file_ext == 'mp3' || file_ext == 'mp4' || file_ext == 'ogg') {

          Song.findByIdAndUpdate(songId, {file: file_name}, (err, songUpdated) => {

            if (err) {
              res.status(500).send({message: 'Error del servidor'});
            } else {
              if (!songUpdated) {
                res.status(404).send({message: 'Error al actualizar usuario'});
              } else {
                res.status(400).send({song: songUpdated});
              }
            }
          })

        } else {
          res.status(200).send({message: 'Extension del archivo no valida'});
        }
      }else {
        res.status(200).send({message: 'no has subido ninguna imagen'});

      }
    }

    function getFile(req, res){
      var imageFile = req.params.songFile;
      var path_file = './uploads/songs/'+ imageFile;

      fs.access(path_file, fs.constants.F_OK, (err) => {
        if(err){
          res.status(200).send({message: 'no existe imagen'})
        }else {
          res.sendFile(path.resolve(path_file));
        }
      })
    }

module.exports = {
          getSong,
          saveSong,
          getAll,
          updateSong,
          deleteSong,
          uploadFile,
          getFile
        }
