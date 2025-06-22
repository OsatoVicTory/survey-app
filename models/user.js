// models/Item.js
import mongoose from 'mongoose';

const SurveyUserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

SurveyUserSchema.set("timestamps", true);

export default mongoose.models.SurveyUser || mongoose.model('SurveyUser', SurveyUserSchema);