var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
// var whitelist = ['http://localhost'];
// corsOptions = {
//     origin: function (origin, callback) {
//       // allow request with no origin contoh mobile app, curl request
//       if(!origin) return callback(null, true);
  
//       if( whitelist.indexOf(origin) === -1 ){
//         var msg = 'The CORS policy for this site does not allow access from specified origin';
//         return callback( new Error(msg),  false );
//       }
  
//       return callback(null, true);
//     }
//   }
// app.options('*', cors())
// app.use(cors(corsOptions));
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))
var Message = mongoose.model('Message',{
  name : String,
  message : String
})

var dbUrl = 'mongodb://localhost:27017/chat';


app.get('/messages', (req, res) => {
  Message.find({},(err, messages)=> {
    res.send(messages);
  })
})
app.post('/messages', (req, res) => {
    console.log(req.body);
  var message = new Message(req.body);
  message.save((err) =>{
    if(err)
      sendStatus(500);
    io.emit('message', req.body);
    res.sendStatus(200);
  })
})

app.post('/sendChoice1', (req, res) => {
  var Choice1 = mongoose.model('Choice',{
    id_choice : String,
    choice : String,
    id_user : String
  })
  var choice1 = new Choice1(req.body);
  console.log(choice1);
  choice1.save((err) =>{
    if(err)
      sendStatus(500);
    io.emit('choice1', req.body);
    res.sendStatus(200);
  })
})

app.post('/sendChoice2', (req, res) => {
  var Choice2 = mongoose.model('Choice',{
    id_choice : String,
    choice : String,
    id_user : String
  })
  var choice2 = new Choice2(req.body);
  console.log(choice2);
  choice2.save((err) =>{
    if(err)
      sendStatus(500);
    io.emit('choice2', req.body);
    res.sendStatus(200);
  })
})


io.on('connection', () =>{
  console.log('a user is connected')
})
mongoose.connect(dbUrl ,{ useNewUrlParser: true } ,(err) => {
  console.log('mongodb connected',err);
})
var server = http.listen(3001, () => {
  console.log('server is running on port', server.address().port);
});