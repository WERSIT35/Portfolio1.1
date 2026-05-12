import { Schema, model } from 'mongoose';

const educationSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    img: { type: String, required: true },
    name: { type: String, required: true },
    title: { type: String, default: '' },
    degree: { type: String, default: '' },
    subjects: { type: [String], default: [] },
    description: { type: String, default: '' },
    date: { type: String, default: '' },
    coverImage: { type: String },
    coverAlt: { type: String },
    logo: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

educationSchema.set('toJSON', {
  versionKey: false,
  transform: (_doc, ret) => {
    delete ret._id;
    return ret;
  },
});

export const Education = model('Education', educationSchema);
