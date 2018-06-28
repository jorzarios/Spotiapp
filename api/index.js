'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/spotiapp', (err, res) => {
  if(err) {
    throw err;
  }else {
    console.log("la base de datos esta conectada correctamente");
    app.listen(port, function(){
      console.log(`escuchando en el puerto`+ port);

    })
  }
})
