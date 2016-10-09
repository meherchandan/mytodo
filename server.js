var express = require('express'); 
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


var app = express(); 
app.use(express.static(__dirname + '/build'));

mongoose.connect('mongodb://test:test@ds049476.mlab.com:49476/tododb');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
    console.log("connected");
});

var Todo = require('./src/app/models/todosScema');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var port = process.env.PORT || 8080; // set our port
  
var router = express.Router(); // get an instance of the express Router

router.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});
app.set('x-powered-by', false); //to disable the server name from webpage

router.route('/mytodo')
	.post(function(req, res) {
        var todo = new Todo();
        todo.text = req.body.text;
        todo.Completed = req.body.completed;
        todo.save(function(err) {
            if (err) {
                res.send(err);
                console.log(err);
            }
            return 
             res.json({ message: 'todo added!' });
            // Todo.find(function(err, todo) {
            //     if (err) {
            //         res.send(err);
            //         console.log(err);
            //     }
            //     res.set('Content-Type', 'application/json');
            //     res.json(todo);
            // });
        });

    })
    .get(function(req, res) {
        Todo.find(function(err, todo) {
            if (err) {
                res.send(err);
                console.log(err);
            }
            res.set('Content-Type', 'application/json');
            setTimeout(function(){res.json(todo)},100);
        });
    });

    router.route('/mytodo/:todo_id')
     
    .put(function(req, res) {
        Todo.findById(req.params.todo_id, function(err, todo) {
            if (err) {
                res.send(err);
                console.log(err);
            }
            console.log(req.body.text);
            todo.text = req.body.text; 
           todo.save(function(err) {
                if (err) {
                    res.send(err);
                    console.log(err);
                }
                res.json({ message: 'todo updated!' });
            });
        });
    })
    .delete(function(req, res) {
    	console.log("deleting");
        Todo.remove({
            _id: req.params.todo_id
        }, function(err, todo) {
            if (err) {
                res.send(err);
                conosle.log(err);
            }
            return res.json({ message: 'todo deleted!' });

        });
    });

app.use('/', router);
app.listen(port);
console.log('Magic happens on port ' + port);
