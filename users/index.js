const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
//set up express app 
const app = express();
app.use(bodyParser.json());
// connect to mongodb
mongoose.connect('mongodb://localhost:27017/backendDB', { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var dbConn = mongoose.connection;
dbConn.on('error', console.error.bind(console, 'connection error:'));
dbConn.once('open', function(){
console.log('MongoDB is connected to Node');
});
//listen for requests
app.listen(process.env.port || 4000);
console.log('listening port no 4000');
const Schema = mongoose.Schema;
//create users Schema & model
const usersSchema = new Schema({
    username:{
        type:String
    },
    password:{
        type:String
    },
    roles:[{type: String}]
}, {collection: 'users'});
const usersModel = mongoose.model('users',usersSchema);
// for Register purpose from frontend application
app.post('/users/register', registerFunction);
function registerFunction (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    console.log('req.body in register', req.body)
    usersModel.create(req.body, function (err, user) {
    if (err) {
      res.send({ error: true, message: 'Registration Failed' })
    } else {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.send({error: false, message: 'Registered Succeessfully'})
    }
  });
}
// for login purpose from frontend application
app.post('/users/login', loginFunction)
function loginFunction (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    console.log('req.body', req.body)
    usersModel.find({username: req.body.username, password: req.body.password}, function (err, user) {
    if (err) {
      res.send({ error: true, message: 'login Failed' })
    } else {
        console.log('user', user)
        if (user.length > 0) {
            res.send({error: false, message: 'login Succeessfully', result: user})
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.send({error: true, message: 'Invalid Creditials - login Failed'})}
    } 
  });
}