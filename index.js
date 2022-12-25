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

        app.get('/data/:id', async(req,res) =>{
            const {id} = req.params;
            const query = {_id: ObjectId(id)};
            const result = await dataCollection.findOne(query)
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

        app.patch('/data/update/:id', async(req,res)=>{
            const {id} = req.params;
            console.log(id)
            console.log(req.body)
            const query = {_id : ObjectId(id)}
            const result = await dataCollection.updateOne(query,{$set: req.body})
        if(result.matchedCount){
            res.send({
                success: true,
                message: "Changes updated successfully."
            })
        }else{
            res.send({
                success: false,
                message: "Failed to update."
            })
        }
        })

        app.delete('/data/delete/:id', async(req,res)=>{
            const {id} = req.params;
            const query = {_id: ObjectId(id)}
            const result = await dataCollection.deleteOne(query)
            if(result.deletedCount){
                res.send({
                    success: true,
                    message: "Deleted the data successfully."
                })
            }else{
                res.send({
                    success: false, 
                    message: "Failed to delete!"
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