'use strict';
var config          = require('./config.js');
var async           = require('async');
var fs              = require('fs');
var path            = require('path');
var express         = require("express");
var app             = express();
var router          = express.Router();
var http            = require('http').Server(app);
var io              = require('socket.io')(http);
var bodyParser      = require('body-parser');
var cookieParser    = require('cookie-parser');
var methodOverride  = require('method-override');
var bunyan = require('bunyan');
var log = bunyan.createLogger({name: 'myapp'});

 /*DB & SESSION*/
var mongoUrl        = 'mongodb://dev:1234@ds149567.mlab.com:49567/seguidorconsumos';
var expressSession  = require('express-session');
var MongoStore      = require('connect-mongo')(expressSession);
var mongo           = require('./mongo');
var mongoose        = require('mongoose');
mongoose.connect(mongoUrl);
var Usuario         = require('./models/usuario.js');
//var Log             = require('./models/log.js');

/*RUTAS*/
var consumoApp = require('./controllers/consumo.js');

/*CONFIG*/
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname + '/views'));
app.set('port', process.env.PORT)

/*MIDDLEWARE*/
/*
if('development' == app.get('env')){
    app.use(express.errorHandler());
}
*/
app.use(methodOverride());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname + '/public')));
app.use(express.static(path.join(__dirname,"bower_components/")));
app.use(cookieParser());
app.use( expressSession({
  secret: 'somesecretrandomstring',
  store: new MongoStore({
    url: mongoUrl
  })
}));

//app.use('/api', someRoute);
function requireUser(req, res, next){
  if (!req.user) {
    res.redirect('/login');
  } else {
    next();
  }
}
function requireUserAdmin(req, res, next){
  if (!req.user) {
    res.redirect('/login');
  }else if(!req.user.admin){
      res.redirect('/app/consumos');
  }
   else{
    next();
  }
}

function authenticateUser(username, password, callback){
  var coll = mongo.collection('usuarios');
  
  coll.findOne({usuario: username, password:password}, function(err, user){
    callback(err, user);
  });
}

function checkIfLoggedIn(req, res, next){
  if (req.session.username) {
    var coll = mongo.collection('usuarios');
    Usuario.findOne({usuario: req.session.username}, function(err, user){
      if (user) {
        // set a 'user' property on req
        // so that the 'requireUser' middleware can check if the user is
        // logged in
        req.user = user;
        // Set a res.locals variable called 'user' so that it is available
        // to every handlebars template.
        res.locals.user = user;
      }

      next();
    });
  } else {
    next();
  }
}
app.use(checkIfLoggedIn);

//ROUTES
app.use('/app', requireUser, consumoApp );
/*GET*/
app.get('/', requireUser, function(req, res){
    console.log('Nueva acceso desde ', req.connection.remoteAddress);
    res.redirect('/app/consumos');
});

app.get('/login', function(req, res){
    res.render('login');
});
app.get('/signup', requireUserAdmin, function(req, res){
    res.render('signup');
});
app.get('/update', requireUserAdmin, function(req, res){
    res.render('update');
});
app.get('/admin', requireUserAdmin, function(req, res){
    Consumos.find(function(err,rows){
        if(err){
            console.log(err);
        }else{
            res.render('admin',{ usuarios: rows});
        }
    });
});
app.get('/logout', requireUser, function(req, res){
    delete req.session.username;
    res.redirect("/login");
});

/*POST*/
app.post('/login', function(req, res){
  // These two variables come from the form on
  // the views/login.hbs page
  var username = req.body.username.toLowerCase();
  var password = req.body.password;

  authenticateUser(username, password, function(err, user){
    if (user) {
      // This way subsequent requests will know the user is logged in.
      req.session.username = user.usuario;
      console.log(req.session.username);
      res.redirect('/app/consumos');
    } else {
      res.render('login', {error: 'Datos de acceso incorrectos.'});
    }
  });
});
app.post('/signup', requireUserAdmin, function(req, res){
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
});
app.post('/update', requireUserAdmin, function(req, res){
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
});
app.post('/getUsuario', requireUserAdmin, function(req, res){
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
});
//SOCKET.IO
io.on('connection', function(socket){
    //console.log('Conexion: ID/IP', socket.id, '/', socket.request.connection.remoteAddress);
    socket.on('nomenAFicha', function(data){
        socket.emit('err', {error: {tipo: 'DB' , mensaje: 'No se pudo conectar a la base de datos.'}, nomenclatura: nomenString});
    });
    socket.on('disconnect', function(){
    });
});

mongo.connect(mongoUrl, function(){
    //console.log('Conectado a MongoDB: ' + mongoUrl);
    http.listen(process.env.PORT, function(){
    //console.log('Server running on %s:%d | PID %d', config.server.ip, config.server.port, config.server.pid);
    });
    
});
