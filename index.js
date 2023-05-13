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
    const bookingsCollection = client.db('carDoctorDB').collection('bookings')

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
            projection: {title:1, price:1, service_id:1, img:1}
        };
        const result = await serviceCollection.findOne(query, options);
        res.send(result);
    })

    // find all booking data with specific user
    // read some data from database
    // http://localhost:5000/bookings?email=ubri@gubri.com
    // http://localhost:5000/bookings?email=ubri@gubri.com&sort=1
    app.get('/bookings', async (req, res) => {
      // console.log(req.query.email);
      let query = {};
      if(req.query?.email){
        query = {email: req.query.email}
      }
      const result = await bookingsCollection.find(query).toArray();
      res.send(result)
    })

    // bookings handle
    app.post('/bookings', async (req, res) => {
      // server received data from client
      const booking = req.body;
      console.log('received data from client', booking)
      // server send data to database booking data store
      const result = await bookingsCollection.insertOne(booking)
      res.send(result)
    })

    // optional: to check server get data
    http://localhost:5000/bookings/645e3603b0caaec5af5a27b2
    app.get('/bookings/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await bookingsCollection.findOne(query)
      res.send(result)
    })


    // update put/patch
    app.patch('/bookings/:id', async (req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const updatedBooking = req.body;
      console.log('received from client', updatedBooking);
      const updateDoc = {
        $set: {
          status: updatedBooking.status
        },
      };
      const result = await bookingsCollection.updateOne(filter, updateDoc)
      res.send(result)
    })

    // delete my Booking <BookingRow.jsx>
    app.delete('/bookings/:id', async (req, res) => {
      const id = req.params.id; 
      const query = {_id: new ObjectId(id)};
      const result = await bookingsCollection.deleteOne(query);
      console.log(result)
      res.send(result)
    })

  


    await client.db("admin").command({ ping: 4});
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