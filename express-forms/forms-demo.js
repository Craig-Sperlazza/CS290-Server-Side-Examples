var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({ defaultLayout: 'main' });
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 56458);

// app.get('/',function(req,res){
//   res.render('home');
// });

// app.get('/show-data',function(req,res){
//   var context = {};
//   context.sentData = req.query.myData;
//   res.render('show-data', context);
// });

// app.get('/get-loopback',function(req,res){
//   var qParams = "";
//   for (var p in req.query){
//     qParams += "The name " + p + " contains the value " + req.query[p] + ", ";
//   }
//   qParams = qParams.substring(0,qParams.lastIndexOf(','));
//   qParams += '.';
//   var context = {};
//   context.dataList = qParams;
//   res.render('get-loopback', context);
// });

app.get('/', function(req, res) {
	var qParams = [];
	for (var p in req.query) {
		qParams.push({ name: p, value: req.query[p] });
	}
	var context = {};
	context.request = 'GET';
	context.queryList = qParams;
	res.render('home', context);
});

app.post('/', function(req, res) {
	var queryParams = [];
	var bodyData = [];
	for (var b in req.body) {
		bodyData.push({ name: b, value: req.body[b] });
	}
	for (var q in req.query) {
		queryParams.push({ name: q, value: req.query[q] });
	}
	// console.log(qParams);
	// console.log(req.body);
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
