import mongoose, { Schema, Types } from 'mongoose';

export interface IUrl {
  ownerId: Types.ObjectId;
  longUrl: string;
  shortCode: string;
  clicks: number;
  isActive: boolean;
  expiresAt?: Date | null;
}

const UrlSchema = new Schema<IUrl>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    longUrl: { type: String, required: true },
    shortCode: { type: String, required: true, unique: true, index: true },
    clicks: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date, default: null }
  },
  { timestamps: true }
);

export default mongoose.model<IUrl>('Url', UrlSchema);
