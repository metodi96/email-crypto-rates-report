const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    btcRates: {
        usd: Number,
        eur: Number
    },
    ethRates: {
        usd: Number,
        eur: Number
    },
    croRates: {
        usd: Number,
        eur: Number
    },
}, {
    timestamps: true,
});

ReportSchema.set('versionKey', false);
module.exports = mongoose.model('Report', ReportSchema);