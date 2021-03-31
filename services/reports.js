const Report = require('../models/report');

const getReports = async (threshold) => {
    try {
        const surveys = await Report.find({threshold: threshold}, null, { limit: 10, sort: { 'createdAt': -1 } })
        return surveys
    } catch (err) {
        console.log(err)
    }
    return []
}

const createReport = async (exchangeRatesFormatted, threshold) => {
    console.log('Trying to create a report...')
    if (typeof exchangeRatesFormatted === 'undefined') return
    console.log('Creating a report with formatted CRO rates....', exchangeRatesFormatted)
    const croRates = exchangeRatesFormatted.croRates
    try {
        const newReport = new Report({ threshold, croRates });
        await newReport.save()
    } catch (err) {
        console.log(err)
    }
}

module.exports = { getReports, createReport }