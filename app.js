const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const customerRouter = require('./src/routes/customer.router.js');
const adminRouter = require('./src/routes/admin.router.js');
const PORT = 5000;
const http = require('http');
const server = http.createServer(app);
const {Server} = require('socket.io');
const lineController = require('./src/controllers/line.controller.js');
const dateController = require('./src/controllers/datemdl.controller.js');
const twilioAPI = require('./src/sendSMS.js');

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST"],
  },
});

mongoose.connect('mongodb+srv://yinoni2212:ihJJG1NMY5X7lHHt@cluster0.k1zk58s.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(() => {
  console.log('Connected to db!');

})
.catch((error) => {
  console.log('Error! ===> ', error);
});

//Server initializes
app.use(bodyParser.json({ type: 'application/json' }))

// Use CORS middleware
app.use(cors());

app.use('/', customerRouter);

app.use('/admin', adminRouter);

io.on('connection', (socket) => {
  console.log('a user connected');

  /*Setting the hours for specific date*/
  socket.on("setHours", async (hoursData) => {
    await dateController.setHours(hoursData);
  });

  /*Adding new line*/
  socket.on("addLine", async (line) => {
    console.log(line);
    let smsMSG = `  נקבע תור חדש!\nבתאריך: ${line.date}\nבשעה: ${line.hour}`

    await lineController.addNewLine(line);

    twilioAPI.sendSMS(smsMSG);

    io.emit("updatedHours", line);
  });

  socket.on("cancelLine", async (lineData) => {
    await lineController.cancelLine(lineData);
    io.emit("postCancelLine", lineData);
  });

  socket.on("disconnect", () => {
    console.log('a user disconnected!');
  })
});

server.listen(PORT, (req, res) => {
    console.log(`Listening on port ${PORT}`);
});

