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

const receiverOne = process.env.RECEIVER
const receiverTwo = process.env.RECEIVER_TWO
const thresholdOne = process.env.THRESHOLD_EUR
const thresholdTwo = process.env.THRESHOLD_EUR_TWO

//define two cron jobs for the different recipients
const cronJob = new CronJob(
    "*/20 * * * *",
    async () => {
        const exchangeRateCRO = await getExchangeRates('CRO')
        const transformedRatesFormat = transformData(exchangeRateCRO)
        await createReport(transformedRatesFormat, thresholdOne)
        sendEmail(receiverOne, thresholdOne)
    },
    null,
    true,
    "UTC"
);

const cronJobTwo = new CronJob(
    "* 10,16,22 * * *",
    async () => {
        const exchangeRateCRO = await getExchangeRates('CRO')
        const transformedRatesFormat = transformData(exchangeRateCRO)
        await createReport(transformedRatesFormat, thresholdTwo)
        sendEmail(receiverTwo, thresholdTwo)
    },
    null,
    true,
    "UTC"
);

const calculateRemainingTime = (cronJob) => {
    const timeUntilNextRunSeconds = cronJob.nextDates(1)[0].unix() - new Date().getTime() / 1000;
    const roundedTime = Math.round(timeUntilNextRunSeconds)
    if (roundedTime % 60 === 0) {
        console.log("Time until next run (min) for cronjob one: ", roundedTime / 60);
    }
}

setInterval(() => {
    calculateRemainingTime(cronJob)
    calculateRemainingTime(cronJobTwo)
}, 1000);

app.get('/', async (req, res) => {
    res.send("Hello")
})

//server is listening on port...
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});