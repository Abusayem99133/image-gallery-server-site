const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ddlv3rx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// console.log(uri);
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
    // await client.connect();

    const galleryCollection = client
      .db("dbUploadGallery")
      .collection("dbGallery");

    // const extraCraftCollection = client
    //   .db("dbArtCraft")
    //   .collection("extraCrafItem");
    app.get("/galleryImage", async (req, res) => {
      const cursor = galleryCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // app.get("/extraCraft", async (req, res) => {
    //   const cursor = extraCraftCollection.find();
    //   const result = await cursor.toArray();
    //   res.send(result);
    //   console.log(result);
    // });
    // update server

    // app.get("/craft/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: new ObjectId(id) };
    //   const result = await artCraftCollection.findOne(query);
    //   res.send(result);
    // });
    app.post("/galleryI", async (req, res) => {
      const upload = req.body;
      console.log(upload);
      const result = await galleryCollection.insertOne(upload);
      res.send(result);
      console.log(result);
    });
    // app.get("/craft/:id", async (req, res) => {
    //   console.log(req.params.id);
    //   const id = req.params.id;
    //   const query = { _id: new ObjectId(id) };
    //   const result = await artCraftCollection
    //     .find({ _id: req.params.id })
    //     .toArray();
    //   res.send(result);
    // });
    // app.get("/artCraft/:email", async (req, res) => {
    //   console.log(req.params.email);
    //   const result = await artCraftCollection
    //     .find({ email: req.params.email })
    //     .toArray();
    //   res.send(result);
    // });
    // app.get("/singleCraft/:id", async (req, res) => {
    //   console.log(req.params.id);
    //   const result = await artCraftCollection.findOne({
    //     _id: new ObjectId(req.params.id),
    //   });
    //   res.send(result);
    // });

    // app.put("/updateCraft/:id", async (req, res) => {
    //   console.log(req.params.id);
    //   const query = { _id: new ObjectId(req.params.id) };
    //   const craftData = {
    //     $set: {
    //       image: req.body.image,
    //     },
    //   };
    //   const result = await artCraftCollection.updateOne(query, craftData);
    //   console.log(result);
    //   res.send(result);
    // });
    // app.delete('/craftDeletes/:id', async(req, res) =>{

    //   const result = await artCraftCollection.deleteOne(query)
    //   res.send(result)
    // })
    // app.delete("/craftDelete/:id", async (req, res) => {
    //   const result = await artCraftCollection.deleteOne({
    //     _id: new ObjectId(req.params.id),
    //   });
    //   console.log(result);
    //   res.send(result);
    // });
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Gallery making to server");
});
app.listen(port, () => {
  console.log(`Gallery server is running : ${port}`);
});
