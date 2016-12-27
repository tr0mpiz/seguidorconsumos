var express = require('express');
var router  = express.Router();
var config  = require('../config.js');
var Consumo = require('../models/consumo.js');

router.get('/', function(req, res){
    res.redirect('/consumos');
});
router.get('/consumo', function(req, res){
    res.render('consumo', { active: 'consumo', usuario: req.session.username, ip: config.server.ip, port: config.server.port });
});

router.get('/consumos', function(req, res){
    Consumo.find({usuario: req.session.username}, function(err,rows1){
        if(err){
            res.status(404).send('<h4>Hubo un error:</h4> <br>' + err);
        }else{
            Consumo.find(function(err, data1){
                var consumos = {data : []};
                for(i in data1){
                    consumos.data.push(data1[i]);
                }
                console.log(consumos);
                Consumo.aggregate([{$group: {_id: "$usuario", total: {$sum:"$importe"}}}],function(err, rows){
                    if(err){
                        res.status(404).send('<h4>Hubo un error:</h4> <br>' + err);
                    }else{
                        res.render('consumos', { pagina: 'inicio', usuario: req.session.username, consumos: consumos, consumoTotal: rows[0].total, consumo: rows1, ip: config.server.ip, port: config.server.port });
                    }
                });
            });
        }
    });
});

router.get('/estadisticas', function(req, res){
    Consumo.find({usuario: req.session.username}, function(err,rows){
        if(err){
            res.status(404).send('<h4>Hubo un error:</h4> <br>' + err);
        }else{
            res.render('estadisticas',{ active: 'estadisticas', usuario: req.session.username, consumo: rows, ip: config.server.ip, port: config.server.port });
        }
    });
});

router.post('/nuevoConsumo', function(req, res){
    var consumo = new Consumo({ usuario: req.session.username, importe: req.body.importe, descripcion: req.body.descripcion });
    consumo.save(function(err, data){
        if(err)
            res.status(404).send('<h4>Hubo un error:</h4> <br>' + err);
        else{
            res.redirect('/consumo');
        }
    });
});

router.get('/api/getConsumos', function(req, res){
    
    Consumo.find({usuario: req.session.username}, function(err,rows){
        if(err){
            res.status(404).send('<h4>Hubo un error:</h4> <br>' + err);
        }else{
            res.status(200).json(rows);
        }
    });
});

module.exports = router;
