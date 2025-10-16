import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  name: { type: String, trim: true },
  email: { type: String, unique: true, lowercase: true, index: true, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['user','admin'], default: 'user' }
}, { timestamps: true });

export default model('User', userSchema);
