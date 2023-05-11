const express = require('express')
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

    const serviceCollection = client.db('carDoctorDB').collection('services')

    // get data from mongo to server
    // http://localhost:5000/services/
    app.get('/services', async (req, res) =>{
        const result = await serviceCollection.find().toArray();
        res.send(result);
    })

    // checkout for specific id 
    // [set route - loaders: ({params}) => fetch(`http://localhost:5000/services/${params.id}`)]
    // http://localhost:5000/services/645cd63525ee0fc71bcf2b73
    app.get('/services/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const options = {
            projection: {title:1, price:1, service_id:1}
        };
        const result = await serviceCollection.findOne(query, options);
        res.send(result);
    })

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