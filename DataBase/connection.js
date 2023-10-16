/* const mongoose = require('mongoose')
mongoose.connect("mongodb+srv://root:root5410@cluster0.buldado.mongodb.net/LocalTools")
 */
const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://root:root5410@cluster0.buldado.mongodb.net/LocalTools", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

// Event handler for a successful connection
db.once('open', () => {
  console.log('MongoDB connection established successfully');
});

// Event handler for a connection error
db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});
