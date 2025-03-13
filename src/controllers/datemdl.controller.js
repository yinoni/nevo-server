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


/*Add specific hour to list

    *** data- {date: any, hour: String}

*/
exports.addHoursToDate = async (data) => {
    DateMdl.updateOne({date: data.date}, {
        $push: {
            hours: {
                $each: [data.hour],
                $sort: 1
            }
        }
    })
    .then(result => {
        console.log('THe result is ====> ', result);
    });
}

/*This function removes specific hour from the date hours list*/
exports.removeHourFromDate = async (data) => {
    DateMdl.updateOne({date: data.date}, {
        $pull: { hours: data.hour }
    })
    .then(result => {
        console.log('THe result is ====> ', result);
    });
}


exports.addSpecificHour = async (hourData, CB) => {
    console.log(`Date: ${hourData.date}\nHour: ${hourData.hour}`);
    await DateMdl.updateOne({date: hourData.date}, {
        $addToSet: {
            hours: hourData.hour  
        }
    })
    .then(res => {
        console.log(`Result ${res.modifiedCount}`)
    });

    await DateMdl.updateOne({date: hourData.date}, {
        $push: {
            hours: {
                $each: [],
                $sort: 1
            }  
        }
    })
    .then(res => {
        console.log(`Sortred!`);   
    });

    
    
}