const express = require('express');
const cors = require('cors')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

const port = 5000 || process.env.PORT;

//midlewares
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.dbUser}:${process.env.dbPassword}@cluster0.skbfv9j.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const dataCollection = client.db('tableData').collection('data');

async function run(){
    try{
        app.get('/data',async(req,res)=>{
            const result = await dataCollection.find({}).toArray();
            res.send({
                success: true,
                data: result
            })
        })

        app.post('/data', async(req,res)=>{
            const insertedData = req.body;
            const result = await dataCollection.insertOne(insertedData);
            if(result.insertedId){
                res.send({
                    success:true,
                    message: "Data inserted successfully"
                })
            }else{
                res.send({
                    success:false,
                    message: "Failed to insert"
                })
            }
        })

        app.patch('/data', async(req,res)=>{
            const {id} = req.params;
            const query = {_id : ObjectId(id)}
            const result = await dataCollection.updateOne(query,{$set: req.body})
        if(result.modifiedCount){
            res.send({
                success: true,
                message: "Changes updated successfully."
            })
        }
        })
    }
    catch(err){
        console.log(err.message)
    }
}
run()
 
app.get('/',(req,res)=> {
    res.send('Server is running')
})

app.listen(port,()=>{
    console.log('server is running on port',port)
})