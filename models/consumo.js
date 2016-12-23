var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var consumoSchema = new Schema({
    usuario: {type: String, required: true },
    importe     : { type: Number, required: true },
    descripcion : { type: String, required: true }
}, {timestamps: true}, { collection: 'consumos' });

consumoSchema.pre('save', function(next) {
    next();
});
var Consumo = mongoose.model('Consumo', consumoSchema);
module.exports = Consumo;