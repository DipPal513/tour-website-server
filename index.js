const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
const ObjectId = require("mongodb").ObjectId;

// middleware
app.use(cors());
app.use(express.json());

// DB_USER=simpleTour

// DB_PASS=eyWzKhAllbJLJXPd

const uri = `mongodb+srv://simpleTour:eyWzKhAllbJLJXPd@cluster0.uzftm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function run() {
  try {
    await client.connect();

    const database = client.db("tourServices");
    const servicesDB = database.collection("services");
    const tourUser = database.collection("tourUser");
    // POST API
    app.post("/addService", async (req, res) => {
      const data = req.body;
      const result = await servicesDB.insertOne(data);
      res.json(result);
    });

    // GET API
    app.get("/services", async (req, res) => {
      const cursor = servicesDB.find({});
      const services = await cursor.toArray();
      res.send(services);
    });
    // my orders

    app.get("/allOrders",async (req,res) => {
      const cursor = tourUser.find({});
      const orders= await cursor.toArray();
      res.json(orders);
     
    })
    app.post('/myOrders',async(req,res)=>{
      const product = req.body;
      const result = await tourUser.insertOne(product);
      res.send(result);
  })
    app.get("/allOrders/:email", async (req, res) => {

      const myOrder = await tourUser
        .find({
          email: req.params.email,
        })
        .toArray();
      res.send(myOrder);
     
    });

    // GET API WITH ID
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await servicesDB.findOne(query);
      res.json(service);
    });
    app.delete("/deleteOrder/:id", async (req, res) => {
      const id = req.params.id;
      const result = await tourUser.deleteOne({
        _id: ObjectId(id),
      });
      console.log('deleted.fired')
      res.send(result);
    });
  } finally {
    // client.close();
  }
}

run().catch((err) => {
  console.dir;
});

app.get("/", (req, res) => {
  res.send("Hi from node js....");
});

app.listen(port, () => {
  console.log("server start at port ", port);
});
