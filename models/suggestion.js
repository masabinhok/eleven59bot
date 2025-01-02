import mongoose from 'mongoose';

const suggestionSchema = new mongoose.Schema ({
  name: {
    type: String,
  },
  suggestion: {
    type: String,
  }
})

const Suggestion = mongoose.model('Suggestion', suggestionSchema);
export default Suggestion;