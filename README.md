# email-crypto-rates-report

A bot that runs a cron job to send an email reporting crypto rates of Crypto.com's token (CRO) using the coinapi.io API and also to save those reports in a NoSQL database (MongoDB).
I have used https://elasticemail.com for the SMTP server from which I send out the emails. It is up to you whether you would want to rely on something else.

# Development

## Setup

Make sure you have installed Node.js and added it to the environment path variables

```PS
npm install     # install dependencies
npm start       # start the server
```

Furthermore, add a .env file in the root of the project folder using the template below

```shell
PORT=the port on which the server is running
SMTP_USER=the email from which the SMTP server is sending out the mails
SMTP_PASS=the password for your SMTP server username
RECEIVER=the receiving email address to which the reports are being sent out every 30 minutes
COIN_API_KEY=your COINAPI key
ATLAS_URI=your MongoDB Atlas URI
```
