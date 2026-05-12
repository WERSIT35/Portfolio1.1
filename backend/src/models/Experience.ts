import { Schema, model } from 'mongoose';

const experienceSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    role: { type: String, required: true },
    company: { type: String, required: true },
    date: { type: String, required: true },
    summary: { type: String, required: true },
    chips: { type: [String], default: [] },
    bullets: { type: [String], default: [] },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

experienceSchema.set('toJSON', {
  versionKey: false,
  transform: (_doc, ret) => {
    delete ret._id;
    return ret;
  },
});

export const Experience = model('Experience', experienceSchema);
