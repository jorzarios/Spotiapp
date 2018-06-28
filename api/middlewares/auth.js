'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta'; 

exports.ensureAuth = (req, res, next) => {
  if(!req.headers.authorization){
    return res.status(403).send({message: 'La peticion no tiene la cabecera de autenticacion'})
  }

  var token = req.headers.authorization.replace(/['"]+/g, '');

  try {
    var payload = jwt.decode(token, secret);

    if (payload.exp <= moment().unix()) {
      return res.status(401).send({message: 'El token ha expirado'})
    }
  } catch (e) {
    console.log(e);
    return res.status(404).send({message: 'Token invalido'});
  }

  req.user = payload;
  next();
};
