import mongoose, { Schema, Document } from 'mongoose';
import { Nutritionist as INutritionist } from '../../domain/types/Nutritionist';

export interface NutritionistDocument extends INutritionist, Document {
  createdAt: Date;
  updatedAt: Date;
}

const NutritionistSchema = new Schema<NutritionistDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Avoid OverwriteModelError in Next.js HMR
export const NutritionistModel =
  mongoose.models.Nutritionist ||
  mongoose.model<NutritionistDocument>('Nutritionist', NutritionistSchema);
