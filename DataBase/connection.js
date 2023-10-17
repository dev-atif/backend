/* const mongoose = require('mongoose')
mongoose.connect("mongodb+srv://root:root5410@cluster0.buldado.mongodb.net/LocalTools")
 */
const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://root:root5410@cluster0.buldado.mongodb.net/LocalTools?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(()=>{console.log('MongoDB connected')}).catch((err)=>{
  console.log('Mongodb Not connected--->',err.message)
})