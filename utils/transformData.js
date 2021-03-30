const transformData = (exchangeRateCRO) => {
    if (typeof exchangeRateCRO === 'undefined' || 
        exchangeRateCRO.rates.length === 0) return

    const exchangeRateCROFiltered = exchangeRateCRO.rates.filter(entry => entry.asset_id_quote === 'USD' ||
        entry.asset_id_quote === 'EUR')

    const exchangeRateCROFinalObject = {
        croRates: {
            usd: exchangeRateCROFiltered.find(entry => entry.asset_id_quote === 'USD').rate,
            eur: exchangeRateCROFiltered.find(entry => entry.asset_id_quote === 'EUR').rate
        }
    }

    return exchangeRateCROFinalObject
}

module.exports = transformData