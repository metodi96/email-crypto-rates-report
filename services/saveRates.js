const Report = require('../models/report');

const createReport = async (exchangeRatesFormatted) => {
    console.log('Creating a report with formatted rates....', exchangeRatesFormatted)
    const btcRates = exchangeRatesFormatted.btcRates
    const ethRates = exchangeRatesFormatted.ethRates
    const croRates = exchangeRatesFormatted.croRates
    try {
        const newReport = new Report({ btcRates, ethRates, croRates });
        await newReport.save()
    } catch (err) {
        console.log(err)
    }
}

module.exports = createReport