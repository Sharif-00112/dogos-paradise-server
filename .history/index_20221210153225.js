const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const port = process.env.PORT || 3005;

//firebase admin initialization 
//private_key_file-name: doctors-portal-00112-firebase-adminsdk-rhu8v-7c0acf8d5a.json
var admin = require("firebase-admin");
// var serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
// var serviceAccount = require('./doctors-portal-00112-firebase-adminsdk-rhu8v-7c0acf8d5a.json');
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });


const app = express();

//middleware
app.use(cors());
app.use(express.json());

//connecting database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gddtk1o.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


//Verify Firebase token using external function 
// async function verifyToken(req, res, next) {
//   if(req.headers?.authorization?.startsWith('Bearer ')){
//     const idToken = req.headers.authorization.split(' ')[1];
//     // console.log('Inside separate function:', idToken);
//     try{
//       const decodedUser = await admin.auth().verifyIdToken(idToken);
//       // console.log(decodedUser);
//       // console.log('email:', decodedUser.email);
//       req.decodedEmail = decodedUser.email;
//     }catch (error){
//       console.log(error);
//     }
//   }
//   next();
// }


// CRUD Operation
async function run() {
  try {
    await client.connect();
    console.log('Alhamdulillah, Database Connected Successfully!');

    const testDatabase = client.db("test_DB");
    const testCollection = testDatabase.collection("test_collection");
    
    const dogosParadiseDatabase = client.db("dogos-paradise-database");
    const dogsCollection = dogosParadiseDatabase.collection("dogs");
    const userCollection = dogosParadiseDatabase.collection("users");

    //GET dogs API (all)
    app.get('/dogs', async(req, res) => {
      const cursor = dogsCollection.find({});
      const dogs = await cursor.toArray();
      res.send(dogs);
      // res.json(dogs);
    })


    // POST an user to database (custom sign in)
    app.post('/users', async(req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      // console.log(result);
      res.json(result);
    })

    // GET a single user by email API
    app.get('/users/:email', async(req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await userCollection.findOne(query);
      let isAdmin = false;
      if(user?.role === 'admin'){
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    })


    // UPSERT an user to database (check if exists; then replace or add)
    app.put('/users', async(req, res) => {
      const user = req.body;
      // console.log('put', user);
      // check if the user exists
      const filter = { email: user.email };
      // create if does not match
      const options = { upsert : true };
      const updateDoc = {$set: user};
      const result = await userCollection.updateOne(filter, updateDoc, options);
      // console.log(result);
      res.json(result);
    })

    //Make Admin
    app.put('/users/admin',  async(req, res) => {
      const user = req.body;
      // console.log('put', user);
      // console.log('put', req.headers);
      // console.log('put', req.headers.authorization);
      // console.log('Decoded Email:', req.decodedEmail);

      const requester =  req.decodedEmail;
      if(requester){
        const requesterAccount = await userCollection.findOne({email: requester});
        if(requesterAccount.role != 'admin'){
          const filter = {email: user.email};
          const updateDoc = {$set: {role: 'admin'}};
          const result = await userCollection.updateOne(filter, updateDoc);
          res.json(result);
        }
      }
      else{
        // 403 is forbidden status
        res.status(403).json({message: 'You do not have permission to this page'})
      }
    })

  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello Dogos Paradise!');
}); 

app.listen(port, () => {
  console.log(`My app is listening on port ${port}`);
});


// Database login information (.env)
  // DB_USER=dogos-paradise-user-2
  // DB_PASS=azCyF7N7kHim1CE2


// API Naming Convention
//   app.get('/users')  // get all users
//   app.post('/users')  // post or create or add a single user
//   app.get('/users/:id')  // get specific user by id
//   app.put('/users/:id')  // update specific user by id
//   app.delete('/users/:id')  // delete specific user by id