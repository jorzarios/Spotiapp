'use strict'
var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
var fs = require('fs');
var path = require('path');

function pruebas(req, res){
  res.status(200).send({
    message: `Probando accion del controlador del apirest con node y mongo`
  });
}

function saveUser(req, res){
  var user = new User();

  var params = req.body;

    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_ADMIN';
    user.image = 'null';

  if(params.password){
    bcrypt.hash(params.password, null, null, (err, hash) => {
      user.password = hash;

      if(user.name != null && user.surname != null && user.email != null){
        user.save((err, userStored) => {
          if(err){
            res.status(500).send({
              message: 'Error al guardar el usuario'
            });
          }else {
            if(!userStored){
              res.status(404).send({
                message: 'No ha registrado el usuario'
              });
            }else{
              res.status(200).send({
                user: userStored
              });
            }
          }
        })
      }else{
        res.status(200).send({
          message: 'Introduce todos los campos'
        });
      }
    })
  }else{
    res.status(500).send({
      message: 'Introduce la contraseña'
    });
  }
}

function userLogin(req, res){
  var params = req.body;

  var email = params.email;
  var password = params.password;

  User.findOne({email: email.toLowerCase()}, (err, user) => {
    if(err){
      res.status(500).send({message: 'error en la peticion'});
    }else{
      if(!user){
        res.status(404).send({message: 'error en la peticion'});
      }else{
        bcrypt.compare(password, user.password, (err, check) => {
          if(check){
            if(params.gethash){
              res.status(200).send({
                token: jwt.createToken(user)
              });
            }else{
              res.status(200).send({user});
            }
          }else {
            res.status(404).send({message: 'No ha podido logearse'});
          }
        })
      }
    }
  })
}

function updateUser(req, res){
  var userId = req.params.id;
  var update = req.body;

  User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
    if (err) {
      res.status(500).send({message: 'Error del servidor'});
    } else {
      if (!userUpdated) {
        res.status(404).send({message: 'Error al actualizar usuario'});
      } else {
        res.status(400).send({user: userUpdated});
      }
    }
  })
}

function uploadImage(req, res) {
  var userId = req.params.id;
  var file_name = 'No subido...';

  if (req.files) {
    var file_path = req.files.image.path;
    var file_split = file_path.split("/");
    var file_name = file_split[2];

    var ext_split = file_name.split('\.');
    var file_ext = ext_split[1];

    if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {

      User.findByIdAndUpdate(userId, {image: file_name}, (err, userUpdated) => {

        if (err) {
          res.status(500).send({message: 'Error del servidor'});
        } else {
          if (!userUpdated) {
            res.status(404).send({message: 'Error al actualizar usuario'});
          } else {
            res.status(200).send({image: file_name, user: userUpdated});
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
  var path_file = './uploads/users/'+ imageFile;

  fs.access(path_file, fs.constants.F_OK, (err) => {
    if(err){
      res.status(200).send({message: 'no existe imagen'})
    }else {
      res.sendFile(path.resolve(path_file));
    }
  })
}

module.exports = {
  pruebas,
  saveUser,
  userLogin,
  updateUser,
  uploadImage,
  getImageFile
};
