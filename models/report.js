const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    threshold: Number,
    croRates: {
        usd: Number,
        eur: Number
    },
}, {
    timestamps: true,
});

ReportSchema.set('versionKey', false);
module.exports = mongoose.model('Report', ReportSchema);