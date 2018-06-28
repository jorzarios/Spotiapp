'use strict'

var path = require('path');
var fs = require('fs');
var paginate = require('mongoose-pagination')
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getArtist(req, res) {

  var artistId = req.params.id

  Artist.findById(artistId, (err, artist) => {
    if (err) {
      res.status(500).send({message: "Error en la peticion"})
    } else {
      if (!artist) {
        res.status(404).send({message: "Arrtista no existe"})
      } else {
        res.status(200).send({artist})
      }
    }
  })
}

function getAll(req, res) {

  var page = req.params.page || 1
  var itemsPerPage = 3

  Artist.find().sort('name').paginate(page, itemsPerPage, (err, artists, total) => {
    if (err) {
      res.status(500).send({message: "Error en la peticion"})
    } else {
      if (!artists) {
        res.status(404).send({message: "Artistas no existen"})
      } else {
        return res.status(200).send({totalItems: total, artists: artists})
      }
    }
  })

}

function saveArtist(req, res) {
  var artist = new Artist()
    var params = req.body

      artist.name = params.name,
      artist.description = params.description,
      artist.image = 'null'

      artist.save((err, artistStored) => {

        if (err) {
          res.status(500).send({message: "Error al guardar el artista"})
        } else {
          if (!artistStored) {
            res.status(404).send({message: "ARtista no ha sido guardado"})
          } else {
            res.status(200).send({artist: artistStored})
          }
        }
      })
    }

function updateArtist(req, res) {
      var artistId = req.params.id;
      var update = req.body;

      Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) => {
        if (err) {
          res.status(500).send({message: 'Error del servidor'});
        } else {
          if (!artistUpdated) {
            res.status(404).send({message: 'Error al actualizar el artista'});
          } else {
            res.status(400).send({artist: artistUpdated});
          }
        }
      })
    }

function deleteArtist(req, res) {
      var artistId = req.params.id;

      Artist.findByIdAndRemove(artistId, (err, artistRemoved) => {
        if (err) {
          res.status(500).send({message: 'Error del servidor'});
        } else {
          if (!artistRemoved) {
            res.status(404).send({message: 'Error al eliminar al artista'});
          } else {

            Album.find({artist: artistRemoved._id}).remove((err, albumRemoved) => {
              if (err) {
                res.status(500).send({message: 'Error del servidor'})
              }else{
                if(!albumRemoved) {
                  res.status(404).send({message: 'Error al borrar el album'})
                }else {

                  Song.find({album: albumRemoved._id}).remove((err, songRemoved) => {
                    if (err) {
                      res.status(500).send({meesage: 'Error del servidor'})
                    } else {
                      if (!songRemoved) {
                        res.status(404).send({message: 'Error al borrar la cancion'})
                      }else {
                        res.status(200).send({artistRemoved});
                      }
                    }
                  })
                }
              }
            })
        }
      }
      });
    }

    function uploadImage(req, res) {
      var artistId = req.params.id;
      var file_name = 'No subido...';

      if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split("/");
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {

          Artist.findByIdAndUpdate(artistId, {image: file_name}, (err, artistUpdated) => {

            if (err) {
              res.status(500).send({message: 'Error del servidor'});
            } else {
              if (!artistUpdated) {
                res.status(404).send({message: 'Error al actualizar usuario'});
              } else {
                res.status(400).send({artist: artistUpdated});
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

    function getImageFile(req, res){
      var imageFile = req.params.imageFile;
      var path_file = './uploads/artists/'+ imageFile;

      fs.access(path_file, fs.constants.F_OK, (err) => {
        if(err){
          res.status(200).send({message: 'no existe imagen'})
        }else {
          res.sendFile(path.resolve(path_file));
        }
      })
    }

module.exports = {
          getArtist,
          saveArtist,
          getAll,
          updateArtist,
          deleteArtist,
          uploadImage,
          getImageFile
        }
