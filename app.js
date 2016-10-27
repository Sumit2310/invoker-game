var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require("path")


var port = 3000;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/spell_db');


var Spell = require('./models/Spell');

var app = express();

app.set('port', (process.env.PORT || 3000));

/** MIDDLEWARES */
app.use(express.static(path.join(__dirname, 'public/')));
app.use(bodyParser.urlencoded( {extended: true }));
app.use(bodyParser.json({limit: '10mb'}));

/** API **/

app.get('/ping', function(req, res) {
    var message  = 'Connected!!';
    res.json({
        message : message
    });
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.get('/admin', function(req, res) {
    res.sendFile(path.join(__dirname, 'views/admin.html'));
})

/* SPELL API */


/** ADD SPELL **/

app.post('/spell', function(req, res) {
    console.log("Request Body "+ JSON.stringify(req.body));
    var name = req.body.name;
    var manaCost = req.body.mana_cost;
    var keys  = req.body.keys;
    var description = req.body.description;
    var image = req.body.image;

    var spell = new Spell();
    spell.name = name;
    spell.mana_cost = manaCost;
    spell.keys = keys;
    spell.description = description;
    spell.image = image;

    spell.save(function(err) {
        if (err) {
            console.log("Something went wrong: " + err);
            return res.json({
                message : 'Something went wrong',
                error : err
            });
        }
        console.log("Save successfully");
        res.json({
            message : 'Spell added successfully',
            data : spell
        });
    });
});

/** GET ALL SPELL **/
app.get('/spell', function(req, res) {
    Spell.find(function(err, spells) {
    if (err) {
        return res.json({
            message : 'Something went wrong',
            error : err
        });
    }
    res.json(spells);
  });
});


/** Get Single Spell By Id **/
app.get('/spell/:spell_id', function(req, res) {
    var spellId = req.params.spell_id;
    Spell.findById(spellId, function(err, spell) {
        if (err) {
            return res.json({
                message : 'Something went wrong',
                error : err
            });
        }
        res.json(spell);
    });
});

/**
    COMBO API
*/

app.listen(port);
console.log("listening on port" +port);
