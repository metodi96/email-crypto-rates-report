const express = require('express');
const cors = require('cors');
const CronJob = require("cron").CronJob;
require('dotenv').config();

const sendEmail = require('./services/email')
const getExchangeRates = require('./services/exchangeRates')

const app = express();

const PORT = process.env.PORT || 5000;

//cors middleware
app.use(cors());

//this will allow us to parse json
app.use(express.json());

const cronJob = new CronJob(
    "*/30 * * * *",
    async () => {
        const exchangeRateBTC = await getExchangeRates('BTC')
        const exchangeRateETH = await getExchangeRates('ETH')
        const exchangeRateCRO = await getExchangeRates('CRO')
        sendEmail(exchangeRateBTC, exchangeRateETH, exchangeRateCRO)
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
    console.log('Email sent')
})

//server is listening on port...
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});