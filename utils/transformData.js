const transformData = (exchangeRateBTC, exchangeRateETH, exchangeRateCRO) => {
    if (typeof exchangeRateBTC === 'undefined' ||
        typeof exchangeRateETH === 'undefined' ||
        typeof exchangeRateCRO === 'undefined') return

    const exchangeRateBTCFiltered = exchangeRateBTC.rates.filter(entry => entry.asset_id_quote === 'USD' ||
        entry.asset_id_quote === 'EUR')
    const exchangeRateETHFiltered = exchangeRateETH.rates.filter(entry => entry.asset_id_quote === 'USD' ||
        entry.asset_id_quote === 'EUR')
    const exchangeRateCROFiltered = exchangeRateCRO.rates.filter(entry => entry.asset_id_quote === 'USD' ||
        entry.asset_id_quote === 'EUR')

    const exchangeRateFinalObject = {
        btcRates: {
            usd: exchangeRateBTCFiltered.find(entry => entry.asset_id_quote === 'USD').rate,
            eur: exchangeRateBTCFiltered.find(entry => entry.asset_id_quote === 'EUR').rate
        },
        ethRates: {
            usd: exchangeRateETHFiltered.find(entry => entry.asset_id_quote === 'USD').rate,
            eur: exchangeRateETHFiltered.find(entry => entry.asset_id_quote === 'EUR').rate
        },
        croRates: {
            usd: exchangeRateCROFiltered.find(entry => entry.asset_id_quote === 'USD').rate,
            eur: exchangeRateCROFiltered.find(entry => entry.asset_id_quote === 'EUR').rate
        }
    }

    console.log('CRO exchange rates example ', exchangeRateFinalObject.croRates)

    return exchangeRateFinalObject
}

module.exports = transformData