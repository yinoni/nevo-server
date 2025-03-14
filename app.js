require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const customerRouter = require('./src/routes/customer.router.js');
const adminRouter = require('./src/routes/admin.router.js');
const PORT = process.env.PORT;
const http = require('http');
const server = http.createServer(app);
const {Server} = require('socket.io');
const lineController = require('./src/controllers/line.controller.js');
const dateController = require('./src/controllers/datemdl.controller.js');
const twilioAPI = require('./src/sendSMS.js');

const io = new Server(server, {
  cors: {
    origin: process.env.ORIGINS.split(',') || [],
    methods: ["GET", "POST"],
  },
});

mongoose.connect(process.env.MONGODB_URL)
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

  /*Adding specific hour to the specific date hours list*/
  socket.on("addSpecificHour", async (hourData) => {
    await dateController.addSpecificHour(hourData);
    io.emit("postAddedSpecificHour", hourData);

  });

  /*Adding new line*/
  socket.on("addLine", async (line) => {
    console.log(line);
    let smsMSG = `  נקבע תור חדש!\nבתאריך: ${line.date}\nבשעה: ${line.hour}`

    await lineController.addNewLine(line);

    //twilioAPI.sendSMS(smsMSG);
    socket.broadcast.emit("updatedHours", line);
    io.emit('addedLine', line);
  });

  socket.on("cancelLine", async (lineData) => {
    await lineController.cancelLine(lineData);

    //Return the canceled line back to the list
    await dateController.addHoursToDate({date: lineData.date, hour: lineData.hour});
    
    io.emit("postCancelLine", lineData);
  });

  socket.on("removeHourFromDate", async (data) => {
    await dateController.removeHourFromDate(data);
    socket.broadcast.emit("updatedHours", data);
  })

  socket.on("disconnect", () => {
    console.log('a user disconnected!');
  })
});

server.listen(PORT, (req, res) => {
    console.log(`Listening on port ${PORT}`);
});

