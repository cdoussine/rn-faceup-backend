const mongoose = require('mongoose');

// useNewUrlParser ;)
var options = {
  connectTimeoutMS: 5000,
  useNewUrlParser: true,
  useUnifiedTopology: true
};

var url =
  'mongodb+srv://cdoussine:Acmsjm9000!@cluster0-c8nkq.mongodb.net/faceup?retryWrites=true&w=majority';

mongoose.connect(url, options, function(err) {
  if (err) {
    console.log(err);
  } else {
    console.info('Database faceup connection OK');
  }
});

module.exports = mongoose;
