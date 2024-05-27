const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const port = 4000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

const mongotu = {
  connectToDb: (cb) => {
    MongoClient.connect('mongodb://localhost:27017/studentsdb').then((client) => {
      dbConnection = client.db();
      return cb()
    })
    .catch(err => {
      console.log(err)
      return cb(err)
    })
  },
  getDb: () => dbConnection
}

let db;

mongotu.connectToDb((err) => {
  if(!err) {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    })
    db = mongotu.getDb();
  }
})

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/register.html')
})

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html')
})

app.get('/success', async (req, res) => {
  try {
    let accounts = [];
    db.collection('accountInfoCollection').find({}, {projection: {_id: 0, idnumber: 1, lastname: 1, firstname: 1, email: 1, contactnumber: 1}})
    .forEach(account => accounts.push(account))
    .then(() => {
      res.status(201).json(accounts);
    })
    .catch(() => {
      res.status(500).json({error: "Cannot get accounts."});
    })
  } catch {
    res.send({err: "Cannot fetch data."});
  }
})

app.get('/welcome', async(req, res) => {
  try {
    res.sendFile(__dirname + '/display-form.html')
  } catch {
    res.send({err: "Cannot find file."});
  }
})

app.post('/', async (req, res) => {
  try {
    const account = {
      idnumber: req.body.idnumber,
      email: req.body.email,
      lastname: req.body.lastname,
      firstname: req.body.firstname,
      address: req.body.address,
      contactnumber: req.body.contactnumber,
      username: req.body.username,
      password: req.body.password,
    };

    const checkIdNo = await db.collection('accountInfoCollection').find({ idnumber: account.idnumber }).toArray();
    const checkEmail = await db.collection('accountInfoCollection').find({ email: account.email }).toArray();
    const checkContactNumber = await db.collection('accountInfoCollection').find({ contactnumber: account.contactnumber }).toArray();
    const checkUsername = await db.collection('accountInfoCollection').find({ username: account.username }).toArray();

    if (checkIdNo.length > 0) {
      res.redirect('/');
    } else if (checkEmail.length > 0) {
      res.redirect('/');
    } else if (checkContactNumber.length > 0) {
      res.redirect('/');
    } else if (checkUsername.length > 0) {
      res.redirect('/');
    }  else {
      db.collection('accountInfoCollection')
      .insertOne(account);
      
      res.redirect('/login');
      res.end();
    }

  } catch {
    res.send({err: "Cannot get data."});
  }
})

app.post('/login', async (req, res) => {
  try {
    const data = await db.collection('accountInfoCollection').findOne({username: req.body.username});

    if (req.body.password === data.password) {
      res.redirect('/welcome');
    } else {
      res.redirect('/login');
    }
  } catch {
    res.redirect('/login');
  }
})