// import express JS module into app
// and creates its variable.
var express = require('express');
var cors = require('cors');
var app = express();
app.use(cors());

// Creates a server which runs on port 8000 and
// can be accessed through localhost:8000
app.listen(8000, function () {
    console.log('server running on port 8000');
})

// Function callName() is executed whenever
// url is of the form localhost:8000/name
app.get('/name', callName);

function callName(req, res) {

    // Use child_process.spawn method from
    // child_process module and assign it
    // to variable spawn
    var spawn = require("child_process").spawn;

    // Parameters passed in spawn -
    // 1. type_of_script
    // 2. list containing Path of the script
    // and arguments for the script

    // E.g : http://localhost:8000/name?firstname=Mike&lastname=Will
    // so, first name = Mike and last name = Will
    var process = spawn('python3', ["./search.py",
        req.query.userName,
        req.query.tweetID]);

    // Takes stdout data from script which executed
    // with arguments and send this data to res object
    process.stdout.on('data', function (data) {
        res.send(data.toString());
    })
}

// save code as start.js
