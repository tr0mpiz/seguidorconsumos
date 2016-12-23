'use strict';
var Usuario = require('./models/usuario');
var config = require('./config');
//GET
module.exports.index = function(req, res){
    console.log('Nueva visita desde:', req.connection.remoteAddress);
    res.render('index',{ficha:"12345 ", usuario: "Andrés vigna", ip: config.server.ip, port: config.server.port });
}
module.exports.indexOver = function(req, res){
    console.log('Nueva visita desde:', req.connection.remoteAddress);
    res.render('indexOver',{ficha:"12345 ", usuario: "Andrés vigna", ip: config.server.ip, port: config.server.port });
}
module.exports.login = function(req, res){
    res.render('login');
}

module.exports.signup = function(req, res){    
    res.render('signup');
}

module.exports.update = function(req, res){    
    res.render('update');
}

module.exports.admin = function(req, res){
    Usuario.find(function(err,rows){
        if(err){
            console.log(err);
        }else{
            res.render('admin',{usuarios: rows});
        }
    });    
}

module.exports.logout = function(req, res){
    res.redirect("/login");
}
//POST
module.exports.loginSubmit = function(req, res){
    var usuarioForm = {
        usuario  : req.body.usuario.toLowerCase(),
        password : req.body.password,
        recordar : Boolean(req.body.recordar) || false
    };
    console.log("1)Peticion para iniciar sesion con las credenciales usuario \'%s\':\'%s\' {recordar: %s}.", usuarioForm.usuario, usuarioForm.password, usuarioForm.recordar);
    Usuario.findOne({'usuario': usuarioForm.usuario}, function(err,data){
        if(err){
            console.log(err);
            res.render('login',{error:'Se ha producido un error al cargar el usuario, intentelo nuevamente.'});
            return handleError(err)
        }else if(data){
            Usuario.findOne({'usuario': usuarioForm.usuario, 'password': usuarioForm.password}, function(err, data){
                if(err){
                    console.log(err);
                    res.render('login',{error:'Se ha producido un error al cargar el usuario, intentelo nuevamente.'});
                    return handleError(err)
                }else if(data){
                    console.log('2)Credenciales validas para el usuario \'%s\', procede a iniciar sesion.',data.usuario);
                    res.redirect('/');
                }else{
                    console.log('2)Credenciales erroneas para el usuario \'%s\': contraseña invalida.', usuarioForm.usuario);
                    res.render('login', {error: 'Contraseña incorrecta para \'' + usuarioForm.usuario + '\'', blanqueo: true});
                }
            });
        }else{
            res.render('login', {error: 'Usuario o contraseña incorrecta. '});
            console.log('2)Credenciales erroneas para el usuario \'%s\': contraseña invalida.', usuarioForm.usuario);
        }
    });
    // These two variables come from the form on
  // the views/login.hbs page
  var username = req.body.username.toLowerCase();
  var password = req.body.password;
  
  authenticateUser(username, password, function(err, user){
    if (user) {
      // This way subsequent requests will know the user is logged in.
      req.session.username = user.usuario;
      console.log(req.session.username);
      res.redirect('/');
    } else {
      res.render('login', {error: 'Datos de acceso incorrectos.'});
    }
  });
}

module.exports.signupSubmit = function(req, res){
    var usuarioForm = {
        usuario     : req.body.usuario.toLowerCase(),
        password    : req.body.password,
        nombre      : req.body.nombre.toLowerCase(),
        apellido    : req.body.apellido.toLowerCase(),
        oficina     : req.body.oficina.toLowerCase(),
        email       : req.body.email.toLowerCase(),
        admin       : Boolean(req.body.admin) || false,
        habilitado  : Boolean(req.body.habilitado) || false
    };    
    console.log("1)Peticion para crear el usuario \'%s\' {habilitado: %s, admin: %s}.", usuarioForm.usuario, usuarioForm.admin, usuarioForm.habilitado);
    Usuario.findOne({'usuario': usuarioForm.usuario}, function(err,data){
        if(err){            
            console.log(err);
            res.render('signup',{error:'Se ha producido un error al cargar el usuario, intentelo nuevamente.'});
            return handleError(err)
        }else if(data){
            console.log('2)El usuario \'%s\' ya existe',data.usuario);
            res.render('signup',{error:'El usuario \'' + usuarioForm.usuario +'\' ya existe.'});
        }else{
            var nuevoUsuario = new Usuario(usuarioForm);
            nuevoUsuario.save(function(err, data){
                console.log("2)Se creo el usuario \'%s\'.", data.usuario);
                res.render('signup',{succes:'El usuario \'' + data.usuario +'\' ha sido creado con exito!'});
            });
        }
    });
}

module.exports.updateSubmit = function(req, res){
    var usuarioForm = {
        id          : req.body.id,
        usuario     : req.body.usuario.toLowerCase(),
        password    : req.body.password,
        nombre      : req.body.nombre.toLowerCase(),
        apellido    : req.body.apellido.toLowerCase(),
        oficina     : req.body.oficina.toLowerCase(),
        email       : req.body.email.toLowerCase(),
        admin       : Boolean(req.body.admin) || false,
        habilitado  : Boolean(req.body.habilitado) || false
    };
    console.log('Datos recibidos para actualizar un usuario:');
    console.log(usuarioForm);
    Usuario.update({ _id: usuarioForm.id }, { $set: { usuario: usuarioForm.usuario,
                                                     password: usuarioForm.password, 
                                                     nombre: usuarioForm.nombre, 
                                                     apellido: usuarioForm.apellido, 
                                                     oficina: usuarioForm.oficina, 
                                                     email: usuarioForm.email, 
                                                     admin: usuarioForm.admin, 
                                                     habilitado: usuarioForm.habilitado }}, function(err, data){
        if(err){
            console.log(err);
            res.render('update', {error: 'No se pudo actualizar el usuario.*'})
        }else if(data){
            console.log('Respuesta de mongo al actualizar %s:\n%s\n-----', data.usuario, data.id_);
            res.render('update', {succes: 'Usuario ' + data.usuario +' (id: ' + data.id_ + ')' + ' modificado con exito'});
        }else{
            res.render('update', {error: 'No se pudo actualizar el usuario.'})
        }
    });
}

module.exports.getUsuario = function(req, res){
    var usuarioForm = {
        usuario     : req.body.usuario.toLowerCase()
    };
    console.log("1)Peticion para modificar el usuario \'%s\'.", usuarioForm.usuario);
    Usuario.findOne({'usuario': usuarioForm.usuario}, function(err,data){
        if(err){
            console.log(err);
            res.render('update',{error:'Se ha producido un error al cargar el usuario, intentelo nuevamente.'});
            return handleError(err)
        }else if(data){
            console.log('2)Se redirecciona a update con el formulario con los datos de \'%s\'', data.usuario);
            //res.render('update',{succes: 'Se cargaron los datos de \'' + data.usuario +'\' para su modificacion.'});
            res.render('update', {usuario: data});
        }else{
                console.log("2)No se encontro al \'%s\' para modificar.", usuarioForm.usuario);
                res.render('update',{error: 'El usuario \'' + usuarioForm.usuario +'\' no existe.'});
        }
    });
}