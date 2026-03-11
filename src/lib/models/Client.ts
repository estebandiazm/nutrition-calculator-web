import mongoose, { Schema, Document } from 'mongoose';
import { DietPlan } from '../../domain/types/DietPlan';
import { Client as IClient } from '../../domain/types/Client';

// --- Sub-Schemas based on domain/types ---

const FoodOptionSchema = new Schema({
  foodName: { type: String, required: true },
  grams: { type: Number, required: true },
  measureUnit: { type: String, default: 'g' },
  notes: { type: String }
}, { _id: false });

const MealBlockSchema = new Schema({
  blockType: { type: String, enum: ['BASE', 'ACOMPAÑAMIENTO', 'GRASA', 'FRUTA'], required: true },
  options: [FoodOptionSchema]
}, { _id: false });

const MealSchema = new Schema({
  mealName: { type: String, required: true },
  blocks: [MealBlockSchema]
}, { _id: false });

const SnackOptionSchema = new Schema({
  optionNumber: { type: Number, required: true },
  description: { type: String, required: true }
}, { _id: false });

const DietPlanSchema = new Schema({
  label: { type: String },
  days: { type: String },
  recommendations: { type: String },
  meals: [MealSchema],
  snacks: [SnackOptionSchema],
}, { timestamps: true });

// --- Main Client Schema ---

// We extend the domain type to include mongoose Document properties
export interface ClientDocument extends Omit<IClient, 'plans' | 'nutritionistId'>, Document {
  plans: DietPlan[];
  nutritionistId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ClientSchema = new Schema<ClientDocument>({
  name: { type: String, required: true },
  targetWeight: { type: Number },
  nutritionistId: { type: Schema.Types.ObjectId, ref: 'Nutritionist', required: true },
  plans: [DietPlanSchema] 
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Avoid OverwriteModelError in Next.js HMR
export const ClientModel = mongoose.models.Client || mongoose.model<ClientDocument>('Client', ClientSchema);
