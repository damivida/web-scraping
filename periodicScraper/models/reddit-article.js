const mongoose = require('mongoose');

const RedditArticle = mongoose.model('RedditArticle', {
        title: {
            type: String,
            required: true
        },
        date: {
            type: Date,
        }
});

module.exports = RedditArticle;