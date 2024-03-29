const express = require('express');
const cors = require('cors');
require('dotenv').config();
// here mongo require 
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


// console.log(process.env.DB_USER);
// console.log(process.env.DB_PASS);
// mongo db connect driver start



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.loifkbc.mongodb.net/?retryWrites=true&w=majority`;
// const uri = "mongodb+srv://<username>:<password>@cluster0.loifkbc.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        // start operation 

        //  const userCollection = client.db('dailypulseDB').collection('users');
        const pdfCollection = client.db('testing-multerDB').collection('pdf-store');
        const offerCollection = client.db('testing-multerDB').collection('offer-store');

        // app.post('/article', async (req, res) => {
        //     const item = req.body;
        //     const result = await articleCollection.insertOne(item);
        //     res.send(result)
        // });
        // pdf post operation 
        app.post('/upload', async (req, res) => {

            const item = req.body;
            const result = await pdfCollection.insertOne(item);
            res.send(result)

        });
        // pdf get operation 
        app.get('/get-pdf', async (req, res) => {
            const result = await pdfCollection.find().toArray();
            res.send(result)
        })
        // offer post operation 
        app.post('/post-offer', async (req, res) => {

            const item = req.body;
            const result = await offerCollection.insertOne(item);
            console.log(result);
            res.send(result)

        });

        // pdf get operation 
        app.get('/get-offer', async (req, res) => {
            const result = await offerCollection.find().toArray();
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('simple CRUD is RUNNING')
});

app.listen(port, () => {
    console.log(`simple CURD is running on port,${port}`);
})