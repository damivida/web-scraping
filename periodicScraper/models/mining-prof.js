const mongoose = require('mongoose');

const MiningProf = mongoose.model('MiningProfCrawlers', {
    method: {
     type: String,
     require: true   
    },
    coinName: {
        type: String,
        required: true
    },
    miningPoolName: {
        type: String,
        require: true
    },
    lastBlockTime: {
        type: String,
        required: false
    },
    profitability: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        require: true
    }
})

module.exports = MiningProf;

