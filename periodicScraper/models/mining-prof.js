const mongoose = require('mongoose');

const MiningProfCrawler = mongoose.model('MiningProfCrawler', {
    miningPool: {
        type: Object,
        required: true
    },
    date: {
        type: Date
    }
})

module.exports = MiningProfCrawler;

