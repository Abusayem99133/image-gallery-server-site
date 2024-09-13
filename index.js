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
    // Connect the client to the server
    // await client.connect();

    const galleryCollection = client
      .db("dbUploadGallery")
      .collection("dbGallery");

    // Get all images
    app.get("/galleryImage", async (req, res) => {
      const cursor = galleryCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Upload a new image
    app.post("/galleryI", async (req, res) => {
      const upload = req.body;
      console.log(upload);
      const result = await galleryCollection.insertOne(upload);
      res.send(result);
      console.log(result);
    });

    // Update image order
    app.patch("/updateImageOrder", async (req, res) => {
      const reorderedImages = req.body.reorderedImages; // Array of images with updated order
      try {
        // Loop through each image and update its order in the database
        const updatePromises = reorderedImages.map((image, index) =>
          galleryCollection.updateOne(
            { _id: ObjectId(image._id) }, // Find the image by _id
            { $set: { order: index + 1 } } // Update its order field
          )
        );

        // Execute all update operations
        await Promise.all(updatePromises);

        res.status(200).send({ message: "Image order updated successfully" });
      } catch (error) {
        console.error("Error updating image order:", error);
        res.status(500).send("Server Error");
      }
    });

    // Delete multiple images by IDs
    app.delete("/galleryImage", async (req, res) => {
      const ids = req.body.ids; // Array of image IDs to delete

      try {
        // Convert array of string IDs to ObjectId
        const objectIds = ids.map((id) => new ObjectId(id));

        // Delete all images that match the given IDs
        const result = await galleryCollection.deleteMany({
          _id: { $in: objectIds },
        });

        if (result.deletedCount > 0) {
          res.status(200).send({ message: "Images deleted successfully" });
        } else {
          res.status(404).send({ message: "No images found to delete" });
        }
      } catch (error) {
        console.error("Error deleting images:", error);
        res.status(500).send("Server Error");
      }
    });

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
  res.send("Gallery server is up and running!");
});

app.listen(port, () => {
  console.log(`Gallery server is running on port: ${port}`);
});
