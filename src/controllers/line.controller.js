const Line = require('../models/line.model.js');
const DateMdl = require('../models/date.model.js');

/*Get all the lines in specific date*/
exports.getLinesByDate = async (req, res) => {
    let data = req.body;
    Line.find({date: data.date}).sort({hour: 1})
    .then(result => {
        res.send(result);
    });
}

/*Adds new line to the DB*/
exports.addNewLine = async (newLine) => {
    let newLineData = new Line(newLine);

    await newLineData.save();

    DateMdl.updateOne({date: newLine.date}, {
        $pull: {hours: newLine.hour}
    })
    .then(result => {
        console.log("result ====> ", result);
    })
    .catch(error => {
        console.log('Error! ===> ', error);
    });
}

/*Cancel line*/
exports.cancelLine = async (lineData) => {

    Line.deleteOne({date: lineData.date, phoneNumber: lineData.phoneNumber, hour: lineData.hour})
    .then((result) => {
        console.log(result);
    });
}
