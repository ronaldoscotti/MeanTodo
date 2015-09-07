// Rotas
// load the todo model
var Todo = require('./models/todo');

// expose the routes to our app with module.exports
module.exports = function (app) {

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

	// App
	app.get('*', function (req, res) {
		res.sendfile('./public/index.html');
	});
}