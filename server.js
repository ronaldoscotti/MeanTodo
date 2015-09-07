// Setup
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

// Config
mongoose.connect('mongodb://node:nodeuser@mongo.onmodulus.net:27017/uwO3mypu');

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ 'extended': 'true' }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());

// Models
var todo = mongoose.model('todo', {
	text: String
});

// Routes 
// API
// Get all todos
app.get('/api/todos', function (req, res) {

	// Use mongoose to get all todos in the database
	todo.find(function (err, todos) {
		// if there is an error retrieving, send the error. nothing after res.send(err) will execute
		if (err)
			res.send(err)
		
		res.json(todos); // return all todos in JSON format
	});
});

// Create todo and send back all todos after creation
app.post('/api/todos', function (req, res) {

	// Create a todo, information comes from AJAX request from Angular
	todo.create({
		text: req.body.text,
		done: false
	}, function (err, todo) {
		if (err)
			res.send(err);

		// get and return all the todos after you create another
		todo.find(function (err, todos) {
			if (err)
				res.send(err)
			res.json(todos);
		});
	});

});

// Delete a todo
app.delete('/api/todos/:todo_id', function (req, res) {
	todo.remove({
		_id: req.params.todo_id
	}, function (err, todo) {
		if (err)
			res.send(err);

		// get and return all the todos after you create another
		todo.find(function (err, todos) {
			if (err)
				res.send(err)
			res.json(todos);
		});
	});
});

// Application
app.get('*', function(req, res) {
	// Load the single view, Angular will take care of the other things
	res.sendfile('./public/index.html');
})

// Starting server
app.listen(3000);
console.log("Todo app running!");