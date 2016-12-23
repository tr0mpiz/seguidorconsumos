var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var logSchema = new Schema({
    tipo        : { type: String, required: true},
    descripcion : { type: String, required: true},
    fechaHoy    : { type: Date, default: Date.now }
},{ collection: 'logs' });

var Log = mongoose.model('Log', logSchema);
module.exports = Log;