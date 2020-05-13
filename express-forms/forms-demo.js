var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({ defaultLayout: 'main' });
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 56458);

app.get('/', function(req, res) {
	var queryParams = [];
	for (var p in req.query) {
		queryParams.push({ name: p, value: req.query[p] });
	}
	console.log(queryParams);
	console.log(req.query);
	var context = {};
	context.request = 'GET';
	context.queryList = queryParams;
	res.render('home', context);
});

app.post('/', function(req, res) {
	var queryParams = [];
	var bodyData = [];
	for (var p in req.body) {
		bodyData.push({ name: p, value: req.body[p] });
	}
	for (var q in req.query) {
		queryParams.push({ name: q, value: req.query[q] });
	}
	console.log(queryParams);
	console.log(req.query);
	console.log(bodyData);
	console.log(req.body);
	var context = {};
	context.queryList = queryParams;
	context.request = 'POST';
	context.bodyList = bodyData;
	res.render('home', context);
});

app.use(function(req, res) {
	res.status(404);
	res.render('404');
});

app.use(function(err, req, res, next) {
	console.error(err.stack);
	res.type('plain/text');
	res.status(500);
	res.render('500');
});

app.listen(app.get('port'), function() {
	console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
