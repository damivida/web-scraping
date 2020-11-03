const mongoose = require('mongoose');

const ScrapingModel = mongoose.model('ScrapingModel', {
    minigPool: {
        type: Object,
        required: true
    },
    date: {
        type: Date
    }
})

module.exports = ScrapingModel;

