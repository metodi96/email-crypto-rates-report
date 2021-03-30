const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const CronJob = require("cron").CronJob;
require('dotenv').config();

const sendEmail = require('./services/email')
const getExchangeRates = require('./services/exchangeRates')
const transformData = require('./utils/transformData')
const { createReport } = require('./services/reports')

const app = express();

const PORT = process.env.PORT || 5000;

//cors middleware
app.use(cors());

//this will allow us to parse json
app.use(express.json());

const uri = process.env.ATLAS_URI;
//start connection
console.log("Attempting database connection...")
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }
);
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})

//we probably need to save the previous exchangeRate (MongoDB connection) to reuse it
const cronJob = new CronJob(
    "*/15 * * * *",
    async () => {
        const exchangeRateCRO = await getExchangeRates('CRO')
        const transformedRatesFormat = transformData(exchangeRateCRO)
        await createReport(transformedRatesFormat)
        sendEmail()
    },
    null,
    true,
    "UTC"
);

setInterval(() => {
    let timeUntilNextRunSeconds = cronJob.nextDates(1)[0].unix() - new Date().getTime() / 1000;
    const roundedTime = Math.round(timeUntilNextRunSeconds)
    if (roundedTime % 60 === 0)
        console.log("Time until next run (min): ", roundedTime / 60);
}, 1000);

app.get('/', async (req, res) => {
    res.send("Hello")
})

//server is listening on port...
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});