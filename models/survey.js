// models/Item.js
import mongoose from 'mongoose';

const SurveySchema = new mongoose.Schema({
  publisher_id: {
    type: String,
    required: true,
  },
  img: {
    type: String,
  },
  public_id: {
    type: String,
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  questions: {
    type: Array,
  },
  responses: {
    type: Array,
    default: [],
  },
  users: {
    type: Array,
    default: [],
  },
});

SurveySchema.set("timestamps", true);

export default mongoose.models.Survey || mongoose.model('Survey', SurveySchema);