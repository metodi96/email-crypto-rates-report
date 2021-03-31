const nodemailer = require('nodemailer');
const { getReports } = require('./reports')
const moment = require('moment')

//send email if there is a significant movement in the rates
const sendEmail = async (receiver, threshold) => {
    const lastTenReports = await getReports(threshold)
    const previousReportsPercentageDiff = lastTenReports.map(report => ({
        croRateEuro: report.croRates.eur,
        changeAgainstThreshold: (report.croRates.eur / threshold) - 1,
        createdAt: report.createdAt
    }))

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

    const croRatesHtmlBody = previousReportsPercentageDiff.reduce((currValue, report) => currValue +
        `<div>
            <p>Threshold: <b>${threshold} &#128;</b></p>
            <p>Current Price: ${report.croRateEuro} &#128;</p>
            <p>
                Difference to threshold (${threshold} &#128;): <span style="color: ${report.changeAgainstThreshold > 0 ? 'green' :
        report.changeAgainstThreshold < 0 ? 'red' : 'black'}">${(report.changeAgainstThreshold * 100).toFixed(3)}%</span>
            </p>
            <p>Captured At: ${moment(report.createdAt).format('DD/MM/YYYY HH:mm')}</p>
        </div><hr>`, '')

    const htmlBody = `
    <html>
        <body>
            <h2>CRO rates in EUR</h2>
            <br>
            <hr>
            <div>${croRatesHtmlBody}</div>
        </body>
    </html>
    `

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: `"Crypto Prices Report Bot 🔥" ${process.env.SMTP_USER}`, // sender address
        to: `${receiver}`, // list of receivers
        subject: "Crypto Prices Report", // Subject line
        html: htmlBody, // html body
    });

    console.log('Message Info: ', info)

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

module.exports = sendEmail