
const https = require('https');

const getExchangeRatesFor = (cryptoSymbol) => {
    return new Promise((resolve, reject) => {
        let body = [];

        const options = {
            "method": "GET",
            "hostname": "rest.coinapi.io",
            "path": `/v1/exchangerate/${cryptoSymbol}?invert=false`,
            "headers": { 'X-CoinAPI-Key': `${process.env.COIN_API_KEY}` }
        }

        // Make the GET request to the API
        https.get(options, (res) => {
            // set the encoding of the response object to utf-8
            res.setEncoding('utf8');
            res.on('data', (data) => {
                body += data
            });
            res.on('end', () => {
                try {
                    if (res.statusCode === 200) {
                        const output = JSON.parse(body);
                        console.log(`Remaining API calls until ${res.rawHeaders[19]}: ${res.rawHeaders[17]}`)
                        // Convert the reponse to JSON
                        resolve(output);
                    }
                }
                catch (err) {
                    console.log(`Error parsing JSON from server:${err.message}`);
                    reject(err);
                }
            });
        }).on('error', (err) => {
            console.log(`Request failed, ${err.message}`);
            reject(err);
        });
    })
}


module.exports = getExchangeRatesFor;
