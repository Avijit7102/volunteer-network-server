const express = require('express')
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wy6ti.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

//console.log(process.env.DB_USER)
const port = process.env.PORT || 5000

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})


//database connection


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const eventCollection = client.db("volunteer").collection("events");
  // perform actions on the collection object
  //client.close();

  app.get('/events', (req,res) => {
      eventCollection.find()
      .toArray((err, items) => {
          //console.log('from database', items)
          res.send(items)
      })
  })
  app.post('/addEvent', (req,res) => {
      const newEvent = req.body;
      console.log('adding new event: ', newEvent);
      eventCollection.insertOne(newEvent)
      .then(result => {
          console.log('inserted count', result.insertedCount)
          res.send(result.insertedCount > 0)
      })
  })

  app.delete('deleteEvent/:id', (req,res) => {
      const id = ObjectId(req.params.id)
      console.log('delete please', id);
      eventCollection.findOneAndDelete({id})
      //.then(document => res.send)
  })
  console.log('database connected')

});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})