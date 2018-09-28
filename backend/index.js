const express = require('express');//for creating restapi
// const routes = require('./routes/api');//it creates and help us to do actions on URL's
const bodyParser = require('body-parser');//it helps to recive data or send data in particular pattern(MIDDLEWARE)
const mongoose = require('mongoose');//to connect mongoDB to node js  
// const router = express.Router();
//set up express app 
const app = express();
// var urlencodedParser = bodyParser.urlencoded({ extended: false });
//initalize routes
app.use(bodyParser.json());
// app.use('/api',routes);
// connect to mongodb
mongoose.connect('mongodb://localhost:27017/backendDB', { useNewUrlParser: true });
mongoose.Promise = global.Promise;

var dbConn = mongoose.connection;
dbConn.on('error', console.error.bind(console, 'connection error:'));
dbConn.once('open', function(){
console.log('MongoDB is connected to Node');
});
const Schema = mongoose.Schema;
//create dropdown data Schema & model
const dropdowndataSchema = new Schema({
    name:{
        type:String
    },
    product:{
        type:String
    },
    quantity:{
        type:Number
    },
    rate:{
        type:Number
    },
    status:{
        type:String
    },
    country:{
        type:String
    },
    transaction:{
        type:String
    },
    dataof:{
        type:String
    }
}, {collection: 'dropdowndata'});
const dropdowndataModel = mongoose.model('Dropdowndata',dropdowndataSchema);

// get a list of ninjas from the db
app.get('/farmer', function(req,res,next){
    dropdowndataModel.find({dataof: 'farmer'}, (err, result) => {
        if(!err) {
            res.send(result);
        }
    })
});
app.get('/distributor', function(req,res,next){
    dropdowndataModel.find({dataof: 'distributor'}, (err, result) => {
        if(!err) {
            res.send(result);
        }
    })
});
app.get('/importer', function(req,res,next){
    dropdowndataModel.find({dataof: 'importer'}, (err, result) => {
        if(!err) {
            res.send(result);
        }
    })
});
app.get('/consumer', function(req,res,next){
    dropdowndataModel.find({dataof: 'consumer'}, (err, result) => {
        if(!err) {
            res.send(result);
        }
    })
});
//listen for requests
app.listen(process.env.port || 5000);
console.log('listening port no 5000');
