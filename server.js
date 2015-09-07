// Setup Inicial
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

// Configurações

mongoose.connect('mongodb://node:nodeuser@mongo.onmodulus.net:27017/uwO3mypu');

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ 'extended': 'true' }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());

// Definindo Models
var Todo = mongoose.model('Todo', {
	text: String
});

// Rotas

// API
// Busca todos os To-dos
app.get('/api/todos', function (req, res) {

	// Usa mongoose para buscar todos os to-dos
	Todo.find(function (err, todos) {

		// Se ocorrer algum erro, receberá um retorno
		if (err)
			res.send(err)
			
		// Retorna os to-dos em json
		res.json(todos);
	});
});

// Cria um to-do e envia de volta todos os outros
app.post('/api/todos', function (req, res) {

	// Cria um to-do, a informação vem por ajax do Angular
	Todo.create({
		text: req.body.text,
		done: false
	}, function (err, todo) {
		if (err)
			res.send(err);

		// Se ocorrer algum erro, receberá um retorno
		Todo.find(function (err, todos) {
			if (err)
				res.send(err)
			res.json(todos);
		});
	});

});

// Deleta um to-do
app.delete('/api/todos/:todo_id', function (req, res) {
	Todo.remove({
		_id: req.params.todo_id
	}, function (err, todo) {
		if (err)
			res.send(err);

		// Retorna todos os to-dos restantes
		Todo.find(function (err, todos) {
			if (err)
				res.send(err)
			res.json(todos);
		});
	});
});

// Inicia o servidor na porta 3000
app.listen(3000);
console.log("App rodando na porta 3000!");