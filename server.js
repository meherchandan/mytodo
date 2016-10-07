var express = require('express'); // call express
var app = express(); // define our app using express
var bodyParser = require('body-parser');
app.use(express.static(__dirname + '/public'));

// configure app to use bodyParser()
// this will let us get the data from a POST

// E:\NewProject\mytodolist\material-ui-webpack-example\src\app\models

var mongoose = require('mongoose');
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
  
  // app.use(app.router);
// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); // get an instance of the express Router

// app.get('/', function(req, res) {
//   res.render('index.html');
// });

// get an instance of the express Router
// middleware to use for all requests
router.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});
// router.get('/', function(req, res) {
//     //res.setHeader('Content-Type', 'application/json');
//    return res.('index');
// });

router.route('/mytodo')

// create a bear (accessed at POST http://localhost:8080/api/bears)
.post(function(req, res) {
        var todo = new Todo();
        todo.text = req.body.text;
        todo.Completed = req.body.completed;
        console.log(req.body.text);
        // save the bear and check for errors
        todo.save(function(err) {
            if (err) {
                res.send(err);
                console.log(err);
            }
            Todo.find(function(err, todo) {
                if (err) {
                    res.send(err);
                    console.log(err);
                }
                return res.json(todo);
            });
        });
    })
    .get(function(req, res) {
        Todo.find(function(err, todo) {
            if (err) {
                res.send(err);
                console.log(err);
            }
            res.json(todo);
            console.log(todo);
        });
    })

    router.route('/todo/:todo_id')
    .put(function(req, res) {
        // use our bear model to find the bear we want
        Todo.findById(req.params.todo_id, function(err, todo) {
            if (err) {
                res.send(err);
                console.log(err);
            }
            todo.text = req.body.text; // update the bears info
            // save the bear
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
        Todo.remove({
            _id: req.params.todo_id
        }, function(err, todo) {
            if (err) {
                res.send(err);
                conosle.log(err);
            }
            return res.json(todo);
        });
    });


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be




// test route to make sure everything is working (accessed at GET http://localhost:8080/api)


// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
