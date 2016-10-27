'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var spellSchema  = new Schema({
    name : { type : String, required : true, unique : false } ,
    mana_cost : { type: Number, required : false, unique : false},
    keys : { type: String, required : true, unique : true },
    description : { type : String, required : false },
    image : {type: String , required : false},
    created_at : Date,
    updated_at :Date,
});

// userSchema.methods.dudify = function() {
//     this.name = this.name + '-dude';
//     return this.name;
// }

spellSchema.pre('save', function(next) {

    var currentDate = new Date();
    this.updated_at = currentDate;

    if (!this.created_at) {
        this.created_at = currentDate;
    }
    next();

});

// the schema is useless so far
// we need to create a model using it
var Spell = mongoose.model('Spell', spellSchema);

//make this available to our users in our Node applications

module.exports = Spell;
