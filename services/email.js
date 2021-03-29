const nodemailer = require('nodemailer');

const sendEmail = async (exchangeRateBTC, exchangeRateETH, exchangeRateCRO) => {

    //dont send email if something went wrong with the API call
    if (typeof exchangeRateBTC === 'undefined' ||
        typeof exchangeRateETH === 'undefined' ||
        typeof exchangeRateCRO === 'undefined') return

    const exchangeRateBTCFiltered = exchangeRateBTC.rates.filter(entry => entry.asset_id_quote === 'USD' ||
        entry.asset_id_quote === 'EUR')
    const exchangeRateETHFiltered = exchangeRateETH.rates.filter(entry => entry.asset_id_quote === 'USD' ||
        entry.asset_id_quote === 'EUR')
    const exchangeRateCROFiltered = exchangeRateCRO.rates.filter(entry => entry.asset_id_quote === 'USD' ||
        entry.asset_id_quote === 'EUR')
    const exchangeRateBTCFinalObject = { BTC: exchangeRateBTCFiltered }
    const exchangeRateETHFinalObject = { ETH: exchangeRateETHFiltered }
    const exchangeRateCROFinalObject = { CRO: exchangeRateCROFiltered }

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.elasticemail.com",
        port: 2525,
        secure: false, // true for 465, false for other ports
        auth: {
            user: `${process.env.SMTP_USER}`,
            pass: `${process.env.SMTP_PASS}`,
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false
        }
    });

    const btcRatesHtmlBody = exchangeRateBTCFinalObject.BTC.reduce((currValue, rate) => 
    currValue + rate.asset_id_quote + ': ' + rate.rate + '<br>', '')
    const ethRatesHtmlBody = exchangeRateETHFinalObject.ETH.reduce((currValue, rate) =>
        currValue + rate.asset_id_quote + ': ' + rate.rate + '<br>', '')
    const croRatesHtmlBody = exchangeRateCROFinalObject.CRO.reduce((currValue, rate) =>
        currValue + rate.asset_id_quote + ': ' + rate.rate + '<br>', '')

    const htmlBody = `
    <h2>BTC</h2>
    <p>${btcRatesHtmlBody}</p>
    <hr/>
    <h2>ETH</h2>
    <p>${ethRatesHtmlBody}</p>
    <hr/>
    <h2>CRO</h2>
    <p>${croRatesHtmlBody}</p>
    `

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: `"Crypto Prices Report Bot 🔥" ${process.env.SMTP_USER}`, // sender address
        to: process.env.RECEIVER, // list of receivers
        subject: "Crypto Prices Report", // Subject line
        html: htmlBody, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

module.exports = sendEmail