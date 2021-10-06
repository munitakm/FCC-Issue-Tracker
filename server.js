'use strict';

const express     = require('express');
const bodyParser  = require('body-parser');
const expect      = require('chai').expect;
const cors        = require('cors');
const mongoose    = require('mongoose');
require('dotenv').config();

//connect to MongoDB
mongoose.connect(process.env.MONGO_DB,
  {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => { 
  console.log("we're connected...")
})
//---------------------
//Creating a Model
const { Schema } = require('mongoose');
const schema = new Schema({
  assigned_to: {type: String, default: "", require: false, select: true},
  status_text: {type: String, default: "", select: true},
  open: {type: Boolean, default: true, select: true},
  issue_title: {type: String, required: true, select: true},
  issue_text: {type: String, required: true, select: true},
  created_by: {type: String, required: true, select: true},
  created_on: {type: String, default: "", required: false, select: true},
  updated_on: {type: String, default: "", required: false, select: true},
  project: {type: String, default: "", required: true, select: false},
  __v: {type: Number, select: false}
  });
const Issue = mongoose.model('Issue', schema);
module.exports = Issue;
//---------------------
const apiRoutes         = require('./routes/api.js');
const fccTestingRoutes  = require('./routes/fcctesting.js');
const runner            = require('./test-runner');

let app = express();

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({origin: '*'})); //For FCC testing purposes only



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Sample front-end
app.route('/:project/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/issue.html');
  });

//Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API 
apiRoutes(app);  
    
//404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

//Start our server and tests!
const listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
  if(process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch(e) {
        console.log('Tests are not valid:');
        console.error(e);
      }
    }, 3500);
  }
});

module.exports = app; //for testing
