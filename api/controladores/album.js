'use strict'

var path = require('path');
var fs = require('fs');

var paginate = require('mongoose-pagination')

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getAlbum(req, res) {

  var albumId = req.params.id

  Album.findById(albumId).populate({path: 'artist'}).exec((err, album) => {
    if (err) {
      res.status(500).send({message: "Error en la peticion"})
    } else {
      if (!album) {
        res.status(404).send({message: "Album no existe"})
      } else {
        res.status(200).send({album})
      }
    }
  })
}

function saveAlbum(req, res) {
      var album = new Album()
      var params = req.body

      album.title = params.title,
      album.description = params.description,
      album.year = params.year,
      album.artist = params.artist,
      album.image = 'null'

      album.save((err, albumStored) => {

        if (err) {
          res.status(500).send({message: "Error al guardar el album"})
        } else {
          if (!albumStored) {
            res.status(404).send({message: "albuma no ha sido guardado"})
          } else {
            res.status(200).send({album: albumStored})
          }
        }
      })
    }

function getAll(req, res) {
  var artistId = req.params._id;

  if(!artistId){
    var find = Album.find({}).sort('description')
  }else{

  var find = Album.find({artist: artistId}).sort('year')
}

  find.populate({path: 'artist'}).exec((err, albums) => {
    if(err) {
      res.status(500).send({message: 'Error de peticion'})
    } else {
        if(!albums){
          res.status(400).send({message: 'no hay albums'})
        }else {
          res.status(200).send({albums})
        }
    }
  })
}

function updateAlbum(req, res) {
      var albumId = req.params.id;
      var update = req.body;

      Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) => {
        if (err) {
          res.status(500).send({message: 'Error del servidor'});
        } else {
          if (!albumUpdated) {
            res.status(404).send({message: 'Error al actualizar el lbuma'});
          } else {
            res.status(400).send({album: albumUpdated});
          }
        }
      })
    }

function deleteAlbum(req, res) {
      var albumId = req.params.id;

      Album.findByIdAndRemove(albumId, (err, albumRemoved) => {
        if (err) {
          res.status(500).send({message: 'Error del servidor'});
        } else {
          if (!albumRemoved) {
            res.status(404).send({message: 'Error al eliminar al lbuma'});
          } else {
                  Song.find({album: albumRemoved._id}).remove((err, songRemoved) => {
                    if (err) {
                      res.status(500).send({meesage: 'Error del servidor'})
                    } else {
                      if (!songRemoved) {
                        res.status(404).send({message: 'Error al borrar la cancion'})
                      }else {
                        res.status(200).send({albumRemoved});
                      }
                    }
                  })
                }
              }
            })
          }
//
    function uploadImage(req, res) {
      var albumId = req.params.id;
      var file_name = 'No subido...';

      if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split("/");
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {

          Album.findByIdAndUpdate(albumId, {image: file_name}, (err, albumUpdated) => {

            if (err) {
              res.status(500).send({message: 'Error del servidor'});
            } else {
              if (!albumUpdated) {
                res.status(404).send({message: 'Error al actualizar usuario'});
              } else {
                res.status(400).send({album: albumUpdated});
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
//
    function getImageFile(req, res){
      var imageFile = req.params.imageFile;
      var path_file = './uploads/albums/'+ imageFile;

      fs.access(path_file, fs.constants.F_OK, (err) => {
        if(err){
          res.status(200).send({message: 'no existe imagen'})
        }else {
          res.sendFile(path.resolve(path_file));
        }
      })
    }

module.exports = {
          getAlbum,
          saveAlbum,
          getAll,
          updateAlbum,
          deleteAlbum,
          uploadImage,
          getImageFile
        }
