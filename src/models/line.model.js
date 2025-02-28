const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const lineSchema = new Schema({
    fullName: String,
    phoneNumber: String,
    date: String,
    hour: String
});

const Line = model('Line', lineSchema);

module.exports = Line;