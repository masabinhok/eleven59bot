const mongoose = require('mongoose');

const suggestionSchema = new mongoose.Schema ({
  name: {
    type: String,
  },
  suggestion: {
    type: String,
  }
})

module.exports = mongoose.model('Suggestion', suggestionSchema);