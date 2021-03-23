const express = require('express');
const bodyParser =  require('body-parser');
const cors = require('cors');
const path = require('path'); 
//const dogecoin = require('./server/routes/dogecoind_rpc');
 
const port = 4000;
const app = express();
 
 
// headers and content type
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  
//Set Static Folder
app.use(express.static(path.join(__dirname, 'dist/sketchApp')));
//adding middleware
app.use(cors());

// body parser middleware
app.use(bodyParser.urlencoded({extended:true}));

app.use(bodyParser.json());

app.get('*', (req,res) =>{
res.sendFile(path.join(__dirname, 'dist/sketchApp/index.html'));
});

app.listen(port, function(){
  console.log("Server running on localhost : "+port);
});
