const mongoose = require('mongoose');
const { Schema, model } = mongoose;


const dateSchema = new Schema({
    date: String,
    hours: [String]
});


const DateMdl = model('Date', dateSchema);

module.exports = DateMdl;