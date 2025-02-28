const DateMdl = require('../models/date.model.js');


function generateTimeSlots() {
    let times = [];
    let startHour = 8;
    let endHour = 21;

    for (let hour = startHour; hour <= endHour; hour++) {
        for (let minutes of [0, 30]) {
            if (hour === endHour && minutes !== 0) break; // Prevent adding 21:30
            let formattedHour = hour.toString().padStart(2, '0');
            let formattedMinutes = minutes.toString().padStart(2, '0');
            times.push(`${formattedHour}:${formattedMinutes}`);
        }
    }
    
    return times;
}

/* Set hours range for specific date */
exports.setHours = async (data) => {
    DateMdl.updateOne(
        {date: data.date},
        { $set: {hours: data.hours}},
        {upsert: true}
    )
    .then(result => {
        console.log('THe result is ====> ', result);
    })
}

/* get hours range in specific date */
exports.getHours = async (req, res) => {
    let data = req.body;
    DateMdl.findOne({date: data.date}).then(result => {
        res.send(result || {date: data.date, hours: []});
    })
}