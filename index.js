const express = require('express')
const app = express()

const cors  = require("cors");
require('dotenv').config();
const PORT = process.env.PORT || 5000;
// password 
// P6UBNKFmmBI1AAc7
//middleware

app.use(cors());
app.use(express.json());

const allowedOrigins = ["https://rkbookstore.vercel.app/"];
app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PATCH", "DELETE"]
}));

app.get('/', (req, res) => {
  res.send('Hello World!')
})


// mongodb connection 


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const MONGODB_URI = process.env.MONGODB_URI;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // creating a mongodb databse named bookinvertorry 
    const bookCollections = client.db("BookInventory").collection("books");
    app.post("/upload-book",async (req,res)=>
    {
      const data = req.body;
      const result = await bookCollections.insertOne(data);
      res.send(result);
    })

    // to get all the book 

    app.get("/all-books", async (req,res)=>
    
    {
      const books = bookCollections.find();
      const result = await books.toArray();
      res.send(result);
    })
    
    //updating the book data
    app.patch("/book/:id" , async(req,res)=>
    {
      const id = req.params.id;
      const updateBookData = req.body;
      const filter = {_id: new ObjectId(id)};
      const options = {upsert:true};
      const updateDoc = 
      {
        $set:{
          ...updateBookData
        }
      }
      const result = await bookCollections.updateOne(filter,updateDoc,options);
      res.send(result);
    })

    // for deleting a data 

    app.delete("/book/:id",async(req,res)=>
    {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const result = await bookCollections.deleteOne(filter);
      res.send(result);
    })

    // Find by categories 

    app.get("/all-books" , async(req,res)=>
    {
      let query = {};
      if(req.query?.category)
      {
        query={category:req.query.category}
      }
      const result = await bookCollections.find(query).toArray();
      res.send(result);
    })

    // to get singlw book dT 
    app.get("/book/:id",async(req,res)=>
    {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const result  = await bookCollections.findOne(filter);
      res.send(result);
    })


   
   
    // Send a ping to confirm a successful connection
     await client.db("admin").command({ ping: 1 });
    //console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    
  }
}
run().catch(console.dir);


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})