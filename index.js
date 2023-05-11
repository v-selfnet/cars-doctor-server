const express = require('express')
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config() // for dot .env security
const port = process.env.PORT || 5000

// middleware
app.use(cors());
app.use(express.json());

// console.log(process.env.DB_PASS)

// mongoDB connect
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vgnfmcl.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Car Doctor Server successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);








app.get('/', (req, res) => {
    res.send('Car Doctor Server is Running...');
})

app.listen(port, () => {
    console.log(`Server is Running on Port: ${port}`);
})