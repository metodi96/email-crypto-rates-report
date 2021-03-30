const nodemailer = require('nodemailer');

//send email if there is a significant movement in the rates
const sendEmail = async (exchangeRatesFormatted) => {
    console.log('Sending a mail with formatted rates...', exchangeRatesFormatted)
    //dont send email if something went wrong with the API call
    if (typeof exchangeRatesFormatted === 'undefined') return

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

    const btcRatesHtmlBody = `<p>USD: ${exchangeRatesFormatted.btcRates.usd}</p><p>EUR: ${exchangeRatesFormatted.btcRates.eur}</p>`
    const ethRatesHtmlBody = `<p>USD: ${exchangeRatesFormatted.ethRates.usd}</p><p>EUR: ${exchangeRatesFormatted.ethRates.eur}</p>`
    const croRatesHtmlBody = `<p>USD: ${exchangeRatesFormatted.croRates.usd}</p><p>EUR: ${exchangeRatesFormatted.croRates.eur}</p>`

    const htmlBody = `
    <h2>BTC</h2>
    ${btcRatesHtmlBody}
    <hr/>
    <h2>ETH</h2>
    ${ethRatesHtmlBody}
    <hr/>
    <h2>CRO</h2>
    ${croRatesHtmlBody}
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