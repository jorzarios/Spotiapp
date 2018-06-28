'use strict'

module.exports = function handleError(err, obj) => {
  if (err) {
    res.status(500).send({message: 'Error del servidor'});
  } else {
    if (!obj) {
      res.status(404).send({message: 'Error al eliminar al artista'});
    } else {
      res.status(400).send({obj});
    }
  }
  next()
}
