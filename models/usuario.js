var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({    
    usuario     : { type: String, required: true, unique: true },
    password    : { type: String, required: true },
    nombre      : String ,
    apellido    : String,
    oficina     : String,
    email       : String,
    admin       : {type: Boolean, default: false},
    habilitado  : {type: Boolean, default: false}
}, {timestamps: true} ,{ collection: 'usuarios' });
userSchema.pre('save', function(next) {
    var fechaHoy = new Date();
    this.modificado = fechaHoy;
    if (!this.creado){
        this.creado = fechaHoy;
    }
    next();
});
var Usuario = mongoose.model('Usuario', userSchema);
module.exports = Usuario;