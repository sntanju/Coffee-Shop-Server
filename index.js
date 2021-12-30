const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const  ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.k5fnv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {

    try {

        await client.connect();
        const database = client.db('coffeeshop');
        const coffeeCollection = database.collection('coffee');
        const reviewsCollection = database.collection('reviews');
        const allOrdersCollection = database.collection('allOrders');
        const usersCollection = database.collection('users');

        // GET Products API
        app.get('/coffee', async(req, res) => {
            const cursor = coffeeCollection.find({});
            const size = parseInt(req.query.size);
            const coffee = await cursor.toArray();
            res.send(coffee);
        })

        // POST Products API
        app.post('/coffee', async (req, res) => {
            const coffee = req.body;
            const result = await coffeeCollection.insertOne(coffee);
            console.log(result);
            res.json(result)
        })

        // DELETE Products API 
        app.delete('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await coffeeCollection.deleteOne(query);
            res.json(result);
        })
      
        // GET Reviews API
        app.get('/reviews', async(req, res) => {
            const cursor = reviewsCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews);
        })

        // POST Reviews API
        app.post('/reviews', async (req, res) => {
            const reviews = req.body;
            const result = await reviewsCollection.insertOne(reviews);
            res.json(result)
        })

        
        // GET allOrders API
        app.get('/allOrders', async(req, res) => {
            const cursor = allOrdersCollection.find({});
            const allOrders = await cursor.toArray();
            res.send(allOrders);
        })

        // POST allOrders API
        app.post('/allOrders', async (req, res) => {
            const allOrders = req.body;
            const result = await allOrdersCollection.insertOne(allOrders);
            res.json(result)
        })

        // DELETE allOrders API 
        app.delete('/allOrders/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await allOrdersCollection.deleteOne(query);
            res.json(result);
        })

        // GET myOrder API
        app.get('/allOrders/:email', async(req, res) => {
            const email = req.query.email;
            const query = { email: email}
            const cursor = allOrdersCollection.find(query);
            const allOrders = await cursor.toArray();
            res.send(allOrders);
        })
        

        // GET Users API
         app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })

        // POST Users API
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.json(result);
        });

        // PUT Users API
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin'} };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
        }); 
    }

    finally {

        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Coffee Shop is Running');
});

app.listen(port, () => {
    console.log('Coffee Shop is running on port', port);
});
//https://docs.google.com/document/d/1-6Z0j3uNLR7f7IsMR6dejpQpmZR32QnwaHrce8Gs1lE/edit?fbclid=IwAR257V0ZXjBw3pJzwdXy-akUCE2GdjIpciR1sytvmRbLh1TCO0LaUWS8DIw

//https://drive.google.com/file/d/1MFPgcTTzlUDc5XVU_2DRGE8SnFM72p_n/view?fbclid=IwAR3bV5IGdDUg4P3dZEvQ3JLfQ1IiX_v2wD3cOr2NZtFbBWs61uk3R7E_r0w