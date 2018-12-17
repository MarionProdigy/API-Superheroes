var express = require('express'); // Require Express
var bodyParser = require('body-parser'); // Require the module required for using form data
var app = express(); // Instantiate Express to app-variable

app.use(bodyParser.urlencoded({extended: true})); // For parsing application
app.set('view engine', 'ejs'); // Set EJS
app.use(express.static(__dirname + '/views/pics/')); // Make use of static files
app.set("port", (process.env.PORT || 5000)); // Set port

// Set constants
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://user:salasana123@ds026018.mlab.com:26018/tietokanta";
const database = "tietokanta";

//***********************************************************************************************//
//         root shows the API-documentation                                                      //
//***********************************************************************************************//
app.get("/", (req, res) => {
    res.render("index.ejs");
});

//***********************************************************************************************//
//                    /api/getall                                                                //
//***********************************************************************************************//
app.get("/api/getall", (req, res) => {
  var muuttuja = getAll((err, result) => {
    res.send(result);
  });
});

//*******************************************************************************************//
//                    SHOW ALL                                                               //
//*******************************************************************************************//
function getAll(callback) {
  MongoClient.connect(url, {useNewUrlParser: true}, (err, client) => {
    const db = client.db(database);
    db.collection("heroes").find({}).limit(100).sort({"_id": +1}).toArray((err, result) => {
      // console.log(result);
      client.close();
      callback(err, result);
    });
  });
}

//*******************************************************************************************//
//                /api/get/id_here                                                           //
//******************************************************************************************//
app.get("/api/get/:id", (req, res) => {
  // console.log(res);
  var muuttuja = getById((err, result) => {
    res.send(result);
  });

  function getById(callback) {
    MongoClient.connect(url, {useNewUrlParser: true}, (err, client) => {
      const db = client.db(database);
      db.collection("heroes").find({id: req.params.id}).limit(100).sort({"_id": +1}).toArray((err, result) => {
        client.close();
        callback(err, result);
      });
    });
  };
});

//*******************************************************************************************//
//                  POST data                                                                //
//*******************************************************************************************//
app.post('/api/post', function(req, res) {
  // For testing purpose add test data
  var hero = {
    id: "100",
    Name: "Test Hero",
    Gender: "Unknown",
    Intelligence: "100",
    Strength: "100",
    Speed: "100",
    Power: "100"
  };

  MongoClient.connect(url, {useNewUrlParser: true}, (err, data) => {
    // console.log(data)
    data.db(database).collection("heroes").insertOne(hero);
  });
  res.send("A new Superhero has been added: " + (JSON.stringify(hero.Name)));
});

//*******************************************************************************************//
//                UPDATE data                                                                //
//*******************************************************************************************//
app.put("/api/put/:id", (req, res) => {
  res.send("Superhero's Power got updated!");

  var testPower = "10";
  var data = put((err, result) => {
    res.send(result);
  });

  function put(callback) {
    MongoClient.connect(url, {useNewUrlParser: true}, (err, client) => {
          client.db(database).collection("heroes").updateOne({id: req.params.id}, {$set: {Power: testPower}});
          client.close();
          callback(err, data);
      });
    }
});

//*******************************************************************************************//
//                DELETE data                                                                //
//*******************************************************************************************//
app.delete("/api/delete/:id", (req, res) => {
  res.send("A Superhero has died.");

  var data = deleteId((err, result) => {
    res.send(result);
  });

  function deleteId(callback) {
    MongoClient.connect(url, { useNewUrlParser: true},(err, client) => {
          client.db(database).collection("heroes").deleteOne({id: req.params.id});
          client.close();
          callback(err, data);
      });
    }
});

//*******************************************************************************//
//      All non-valid routes will be redirected back to API-documentation        //
//******************************************************************************//
app.get("*", (req, res) => {
    res.redirect("/");
});

// Start server on port 5000
app.listen(app.get("port"), function() {
  console.log("Node app is running on port", app.get("port"));
});
