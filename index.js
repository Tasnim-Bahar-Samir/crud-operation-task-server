const express = require('express');
const cors = require('cors')
const app = express()
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()

const port = 5000 || process.env.PORT;

//midlewares
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.dbUser}:${process.env.dbPassword}@cluster0.skbfv9j.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");

  console.log('db connected')
  client.close();
});

 
app.get('/',(req,res)=> {
    res.send('Server is running')
})

app.listen(port,()=>{
    console.log('server is running on port',port)
})