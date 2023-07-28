const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Toy Heaven running");
});
// ToyGame
// hlf5AEWLzOAeBkDj

const uri =
  "mongodb+srv://ToyGame:SF0RM57lnr34PsBC@cluster0.znxhrwq.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const toysCollection = client.db("ToyGame").collection("Toys");

    app.get("/all-toys", async (req, res) => {
      const cursor = toysCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/all-toys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toysCollection.findOne(query);
      res.send(result);
    });

    app.get("/my-toys/:email", async (req, res) => {
      const email = req.params.email;
      const query = { seller_email: email };
      const result = await toysCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/add-toys", async (req, res) => {
      const product = req.body;
      const result = await toysCollection.insertOne(product);
      res.send(result);
    });

    app.put("/all-toys/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedToys = req.body;
      const options = { upsert: true };
      const updateData = {
        $set: {
          price: updatedToys.price,
          quantity: updatedToys.quantity,
          description: updatedToys.description,
        },
      };
      const result = await toysCollection.updateOne(
        filter,
        updateData,
        options
      );
      res.send(result);
    });

    app.delete("/all-toys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toysCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Toy heaven listening port,${port}`);
});
