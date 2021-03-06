const express = require('express');
const { MongoClient } = require('mongodb')
const ObjectId = require('mongodb').ObjectId
const cors = require('cors')
require('dotenv').config()
const app = express();
app.use(cors())
app.use(express.json())
const port = process.env.PORT || 5000;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4mjee.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect() 
        const database = client.db("carMechanic");
        const serviceCollections = database.collection("services");
        // GET API 
        app.get('/services', async(req, res)=>{
          
            const cursor = serviceCollections.find({})
            const result = await cursor.toArray();
            res.send(result)
        })
        // GET SINGLE SERVICE 
        app.get('/services/:id', async(req , res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
            const result = await serviceCollections.findOne(query)
            res.send(result)
        })
        // DELETE API 
        app.delete('/services/:id',async(req, res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
            const result = await serviceCollections.deleteOne(query)
            res.send(result)
        })
        // POST API 
        app.post('/services', async(req, res)=>{
            const service = req.body
            const result = await serviceCollections.insertOne(service)
            console.log(result)
            res.json(result)

        })
    }

    finally{

    }
}
run().catch(console.dir);





app.get('/', (req,res)=>{
    res.send('My first database of genius car mechanic')
})

app.listen(port, ()=>{
    console.log('server running on port',port)
})