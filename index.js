const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors')
const app = express();
const port = process.env.PORT || 5000;
const dotEnv = require('dotenv');


dotEnv.config();


app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://allendodul6:DA8T1L9HjlzFaLHG@cluster0.bfzpc41.mongodb.net/?retryWrites=true&w=majority`

// const uri = "mongodb+srv://allendodul6:<password>@cluster0.bfzpc41.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//     serverApi: {
//         version: ServerApiVersion.v1,
//         strict: true,
//         deprecationErrors: true,
//     }
// });


async function run() {
    try {
        // Connect the client to the server (optional starting in v4.7)
        await client.connect();


        const database = client.db('DailyDo');
        const tasksCollection = database.collection('allTasks');
        const projectCollection = database.collection('projects');
        const projectTaskCollection = database.collection('projectSubtasks')
        const usersCollection = database.collection('users');
        const companyCollection = database.collection('companyes');






        //  Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });


        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        app.post('/users', async (req, res) => {
            const user = req.body;
            const company = { companyName: user.companyName };
            const insertCompany = await companyCollection.insertOne(company);
            const result = await usersCollection.insertOne(user);


            res.send(result);
        })


        app.post('/normalUser', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);


            res.send(result);
        })


        app.get('/allUsers', async (req, res) => {
            const cursor = usersCollection.find();
            const result = await cursor.toArray();


            res.send(result)
        })


        app.get('/companyes', async (req, res) => {
            const cursor = companyCollection.find();
            const result = await cursor.toArray();


            res.send(result);
        })


        app.post('/projects', async (req, res) => {
            const projectInfo = req.body;
            const result = await projectCollection.insertOne(projectInfo);


            res.send(result);
        })


        app.get('/projects', async (req, res) => {
            let query = {};


            if (req.query.email) {
                query = { email: req.query.email }
            }
            const result = await projectCollection.find(query).toArray();


            res.send(result);
        })


        app.get('/projects/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const project = await projectCollection.findOne(query);


            res.send(project)
        })

        app.post('/subtask', async (req, res) => {
            const subtask = req.body;
            const result = await projectTaskCollection.insertOne(subtask);


            res.send(result);
        })
        app.get('/subtask', async (req, res) => {
            let query = {};


            if (req.query.projectName) {
                query = { projectName: req.query.projectName };
            }


            const result = await projectTaskCollection.find(query).toArray();
            res.send(result);
        })


        app.put('/subtask/:id', async (req, res) => {
            const id = req.body._id;
            const task = req.body;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };


            const updateSubtask = {
                $set: {
                    taskStatus: task.taskStatus
                }
            }


            const result = await projectTaskCollection.updateOne(filter, updateSubtask, options)


            res.send(result);
        })


        app.delete('/subtask/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await projectTaskCollection.deleteOne(query);


            res.send(result);
        })


        app.post('/tasks', async (req, res) => {
            const task = req.body;
            const result = await tasksCollection.insertOne(task);


            res.send(result)
        })


        app.get('/tasks', async (req, res) => {
            let query = {};


            if (req.query.email) {
                query = { email: req.query.email }
            }
            const result = await tasksCollection.find(query).toArray();


            res.send(result)
        })


        app.delete('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await tasksCollection.deleteOne(query);


            res.send(result)
        })


        app.put('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const task = req.body;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };


            const updateTask = {
                $set: {
                    status: task.status,
                }
            }
            const result = await tasksCollection.updateOne(filter, updateTask, options)


            res.send(result);
        })


       
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('server is running')
})


app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
})

