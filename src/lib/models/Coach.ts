import mongoose, { Schema, Document } from 'mongoose';
import { Coach as ICoach } from '../../domain/types/Coach';

export interface CoachDocument extends ICoach, Document {
  createdAt: Date;
  updatedAt: Date;
}

const CoachSchema = new Schema<CoachDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  authId: { type: String, sparse: true, index: true, unique: true },
}, {
  timestamps: true,
  collection: 'coaches',
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Avoid OverwriteModelError in Next.js HMR
export const CoachModel =
  mongoose.models.Coach ||
  mongoose.model<CoachDocument>('Coach', CoachSchema);
