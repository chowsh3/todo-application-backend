const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const app = express();

app.use(cors());
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "todos"

})

app.get("/tasks", function (req, res) {

  const taskDetail = req.query.taskDetail;
  const query = "SELECT * FROM Task;"

  connection.query(query, function(error, data){
    if(error){
      console.log("Error fetching tasks", error);
      res.status(500).json({
        error:error
      })
    } else {
      res.status(200).json({
        tasks: data
      })
    }
  });
  // const someTasks = [
  //   {
  //   tasks: "water plants", 
  //   completed: false,
  //   date: "2020-06-20",
  //   taskId: 1
  //   },
  //   {
  //   tasks: "buy bread", 
  //   completed: false,
  //   date: "2020-06-20",
  //   taskId: 2
  //  },
  //  {
  //   tasks: "complete tasks", 
  //   completed: false,
  //   date: "2020-06-20",
  //   taskId: 3
  //   }
  // ];

  // res.status(200).send(, taskDetail);
});

// Request body will look something like this
// const body = {
//   text: "Tidy up",
//   completed: false,
//   userId: "1"

// }

app.post("/tasks", function (req, res) {
  const query = "INSERT INTO Task (completed, date, text, userId) VALUES (?, ?, ?, ?);";
  const querySelect = "SELECT * FROM Task WHERE taskId = ?";

  connection.query(query, [req.body.completed, req.body.date, req.body.text, req.body.userId], function (error, data){
    if(error){
      //handle error
      console.log("Error adding task", error);
      res.status(500).json({
        error:error
      })
    } else {
      //handle data
      connection.query(querySelect, [data.insertId], function(error, data){
        if(error){
          console.log("Error adding task", error);
          res.status(500).json({
            error:error
          })
        } else {
          res.status(201).json({
            task: data
          })
        }
      })
    }
  })
  // const text = req.body.text;
  // const date = req.body.date;

  // res.status(201).json({
  //   message: `Received a request to add task ${text} with date ${date}`
  // });
});

app.put("/tasks/:taskId", function (req, res) {
  
  const id = req.params.taskId;

  res.status(200).json({
    message: "You issued a put request for ID: " + id
  });
});

app.delete("/tasks/:taskId", function(req, res) {
  
  const someTasks = [
    {
    tasks: "water plants", 
    completed: false,
    date: "2020-06-20",
    taskId: 1
    },
    {
    tasks: "buy bread", 
    completed: false,
    date: "2020-06-20",
    taskId: 2
   },
   {
    tasks: "complete tasks", 
    completed: false,
    date: "2020-06-20",
    taskId: 3
    }
  ];
  const id = req.params.taskId;



  let highestIdValues = someTasks.map(obj => obj.taskId);
  let highestID = Math.max(...highestIdValues);

  let aResponse = {
    message: " You issued a delete request for ID: " + id
  };

  if(id>highestID) {
    res.status(404);
      aResponse = {
        message: "task " + id + " does not exist"
      };
    
  }

  res.json(aResponse);

});


module.exports.handler = serverless(app);
