var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TodoScema   = new Schema({
   
    text:String,
    Completed:Boolean
});

module.exports = mongoose.model('Todo', TodoScema);