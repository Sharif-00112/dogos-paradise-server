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
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cny0fg3.mongodb.net/?retryWrites=true&w=majority`;
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
    const dogsCollection = dogosParadiseDatabase.collection("dogsCollection");

    //GET appointment API (all)
    // app.get('/appointments', async(req, res) => {
    //   const cursor = appointmentCollection.find({});
    //   const appointments = await cursor.toArray();
    //   // res.send(appointments);
    //   res.json(appointments);
    // })

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
  // DB_USER=doctors-portal-user1
  // DB_PASS=EzVG0BwVrcOO3FdH


// API Naming Convention
//   app.get('/users')  // get all users
//   app.post('/users')  // post or create or add a single user
//   app.get('/users/:id')  // get specific user by id
//   app.put('/users/:id')  // update specific user by id
//   app.delete('/users/:id')  // delete specific user by id