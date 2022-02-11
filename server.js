const express = require('express');
const { MongoClient } = require('mongodb');

const connectionString = "mongodb://localhost:28017";

async function init() {
  const client = new MongoClient(connectionString, {
    useUnifiedTopology: true
  });
  await client.connect;

  const app = express();

  app.get('/get', async (req, res) => {
    const db = await client.db("test");
    const collection = db.collection('pets');

    const pets = await collection.find({
      $text: { $search: req.query.search },
    },
      { _id: 0 }
    )
      .sort({
        score: { $meta: "" }
      })
      .limit(10)
      .toArray();

    res.json({ status: "ok", pets }).end();
  })

  const PORT = 3001;
  app.use(express.static('./static'));
  app.listen(PORT);
  console.log(`running on http://localhost:${PORT}`)
}

init();
