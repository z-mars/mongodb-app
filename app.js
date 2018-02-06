// logs message upon starting app
console.log('app started');

// imports express module & initializes express app
const express = require('express');
const app = express();

// imports built-in node path module
const path = require('path');

// imports body parser module
const bodyParser = require('body-parser');

// imports mongodb node driver & creates const for hosted mongo url
const MongoClient = require('mongodb').MongoClient;

// hosted mongodb instance url 
const url = 'mongodb://test:test@ds161016.mlab.com:61016/employees';

// imports built-in node assert module
const assert = require('assert');

// sets ejs views folder
app.set('views', path.join(__dirname, 'views'));

// sets view engine
app.set('view engine', 'ejs');

// bodyParser middleware (returns POST requests as JSON)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// creates const for name of our database
const dbName = 'employees';

// creates GET request route for index
app.get('/', (req, res) => {

  // opens connection to mongodb
  MongoClient.connect(url, (err, client) => {

    // checks for error connecting to mongodb
    assert.equal(null, err);

    // creates const for our database
    const db = client.db(dbName);

    // creates const for 'employees' collection in database
    const col = db.collection('employees');

    // finds ALL employees in 'employees' collection/converts to array
    col.find({}).toArray((err, docs) => {

      // checks for error connecting to 'employees' collection
      assert.equal(null, err);

      // logs message upon finding collection
      console.log('found employees for index');

      // renders index ejs template and passes employees array as data
      res.render('index', {employees: docs});

      // closes connection to mongodb and logs message
      client.close(() => console.log('connection closed'));

    });

  });

});

// creates GET request route for /employees/add page and renders ejs template
app.get('/employees/add', (req, res) => res.render('employees/add'));

// creates POST request route for /employees/add page
app.post('/employees/add', (req, res) => {

  // logs message with POST request data
  console.log(req.body);

  // creates empty employee object/stores POST request data in employee object
  let employee = {};
  employee.name = req.body.name;
  employee.age = req.body.age;

  // opens connection to mongodb
  MongoClient.connect(url, (err, client) => {

    // checks for error connecting to mongodb
    assert.equal(null, err);

    // creates const for our database
    const db = client.db(dbName);

    // creates const for 'employees' collection in database
    const col = db.collection('employees');

    // inserts ONE employee into 'employees' collection
    col.insertOne(employee, (err, docs) => {

      // checks form error inserting employee to collection
      assert.equal(null, err);

      // logs message upon inserting employee to 'employees' collection
      console.log('employee inserted');

      // redirects user back to index page after POST req submit
      res.redirect('/');

      // closes connection to mongodb and logs message
      client.close(() => console.log('connection closed'));

    });

  });

});

// creates GET request route for /api/data page
app.get('/api/data', (req, res) => {

  // opens connection to mongodb
  MongoClient.connect(url, (err, client) => {

    // checks for error connecting to mongodb
    assert.equal(null, err);

    // creates const for our database
    const db = client.db(dbName);

    // creates const for 'employees' collection in database
    const col = db.collection('employees');

    // finds ALL employees in 'employees' collection/converts to array
    col.find({}).toArray((err, docs) => {

      // checks for error connecting to 'employees' collection
      assert.equal(null, err);

      // logs message upon finding 'employees' collection
      console.log('found employees for api');

      // sends/renders employees array to /api/data page
      res.send(docs);

      // closes connection to mongodb and logs message
      client.close(() => console.log('connection closed'));

    });

  });

});

// listens to port 300 and logs message when listening
app.listen(3000, () => console.log('listening on port 3000'));