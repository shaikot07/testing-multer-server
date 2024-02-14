const express = require('express');
const cors = require('cors');
require('dotenv').config();
// here mongo require 
const { MongoClient, ServerApiVersion } = require('mongodb');
const cloudinary = require('cloudinary').v2;
const formidable = require('formidable');
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
    // Configure Cloudinary with your credentials
    // console.log('Cloud Name:', process.env.Cloud_Name);
    // console.log('API Key:', process.env.API_Key);
    // console.log('API Secret:', process.env.API_Secret);

    cloudinary.config({
      cloud_name: process.env.Cloud_Name,
      api_key: process.env.API_Key,
      api_secret: process.env.API_Secret,

    });


    app.post('/upload', (req, res) => {
      const form = new formidable.IncomingForm();
      
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error('Form parse error:', err);
          return res.status(500).json({ error: 'File upload failed.' });
        }

        const file = files.file;

        // Check if a file was uploaded
        if (!file) {
          return res.status(400).json({ error: 'No file uploaded.' });
        }

        // Upload file to Cloudinary
        cloudinary.uploader.upload(file.path, async (cloudinaryResult) => {
          if (cloudinaryResult.error) {
            console.error('Cloudinary upload error:', cloudinaryResult.error);
            return res.status(500).json({ error: 'Failed to upload file to Cloudinary.' });
          }

          // Cloudinary response contains URL of the uploaded file
          const fileUrl = cloudinaryResult.secure_url;
          console.log('Uploaded file URL:', fileUrl);

          try {
            // Insert file URL into MongoDB
            await pdfCollection.insertOne({ url: fileUrl });
            console.log('File URL saved to MongoDB');
          } catch (mongoErr) {
            console.error('Error inserting document into MongoDB:', mongoErr);
            return res.status(500).json({ error: 'Failed to save file URL to MongoDB.' });
          }

          // Respond with the file URL
          res.status(200).json({ message: 'File uploaded successfully.', fileUrl });
        });
      });
    });


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