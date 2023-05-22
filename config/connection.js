//Required mongoose 
const mongoose = require('mongoose');

// Connection of mongoose with the local server
mongoose.connect('mongodb://localhost:27017/socialmediaDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


module.exports = mongoose.connection;

