// we will require and initiate express, handlebars and body-parser (for post requests)
var express = require('express');
var app = express();
var handlebars = require('express-handlebars').create({ defaultLayout: 'main' });

// the next 3 lines are for post requests only
// This allows us to use body-parser to parse both a json data and x-www-for-urlencoded data in the body
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 56458);

app.get('/', function(req, res) {
	// both our app.get and app.set function will point to the home-handlebars file
	// create an empty array and then use a for loop to push a name(p): value (req.query[p])
	// during each iteration of the for-loop our data will be pushed into the empty array
	// This list is for query data stored in the req.query object
	var queryData = [];
	for (var p in req.query) {
		queryData.push({ name: p, value: req.query[p] });
	}

	// now we have to create an empty object and add the array to the objects.queryList property
	// This makes an array of objects of the format {name:[parameter-name],value:[parameter-value}.
	// We pass then pass that array to the template in the object we send to the template.
	// Then the template can iterate through that array making a list item for each object
	// and populate that list item with the name and values of the things we passed it.
	// We also add the string "GET" to the object under the object.request property
	// This will allow us to access this property in the template
	// NOTE:objectForTemplate.request and objectForTemplate.queryList must be the same as the query in the post
	// This is so we can pass one value into the template and it will use the appropriate post/get
	var objectForTemplate = {};
	objectForTemplate.request = 'GET';
	objectForTemplate.queryList = queryData;
	// now we render that object and for each value called in the home.handlebars file
	// that document will render the value in the appropriate place
	res.render('home', objectForTemplate);
});

// The app.post function operates similarly to the app.get. However, we now have to account
// for both query data and body data. Basically, we just duplicate what we did above but do it twice
// and create two empty arrays, one for bodyData and one for queryData.
// We have to call the appropriate object req.body or req.query and then we use a for loop to
// fill the array with each name:value pair.
app.post('/', function(req, res) {
	var queryData = [];
	var bodyData = [];
	for (var p in req.body) {
		bodyData.push({ name: p, value: req.body[p] });
	}
	for (var q in req.query) {
		queryData.push({ name: q, value: req.query[q] });
	}

	// This operates similarly to the comments made in the app.get. section. However,
	// we now have to set three different key:value pairs in our object.
	// One key (querylist) equal to the queryData array
	// One key (bodylist) equal to the bodyData array
	// One key (request) equal to the string "POST"
	// note that we need to use the same key names for the reuest and queryData that
	// we used in the get function to ensure we can call the appropiate data for
	// either a get or post request
	var objectForTemplate = {};
	objectForTemplate.queryList = queryData;
	objectForTemplate.request = 'POST';
	objectForTemplate.bodyList = bodyData;
	// now we pass that object and for each value called in the home.handlebars file
	// that document will render the value in the appropriate place
	res.render('home', objectForTemplate);
});

// account for a 404 error
app.use(function(req, res) {
	res.status(404);
	res.render('404');
});

// this is our true eror handler function
app.use(function(err, req, res, next) {
	console.error(err.stack);
	res.type('plain/text');
	res.status(500);
	res.render('500');
});

app.listen(app.get('port'), function() {
	console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
