require('dotenv').config();

const accountSid = process.env.TWILIO_SID;
const twilioAuth = process.env.TWILIO_AUTH;


const client = require("twilio")(accountSid, twilioAuth);


exports.sendSMS = async (body) => {
    let msgOptions = {
        from: process.env.TWILIO_FROM,
        to: process.env.TWILIO_TO,
        body
    }

    try{
        const message = client.messages.create(msgOptions);
    }
    catch (error){
        console.log("Error! ====> ", error);
    }
}