import { Schema, model } from 'mongoose';

const certificationSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    name: { type: String, required: true },
    imageName: { type: [String], default: [] },
    image: { type: [String], default: [] },
    description: { type: String, default: '' },
    date: { type: String, default: '' },
    issuer: { type: String, default: '' },
    issued: { type: String, default: '' },
    skills: { type: [String], default: [] },
    timeSpent: { type: String, default: '' },
    tasksMade: { type: [String], default: [] },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

certificationSchema.set('toJSON', {
  versionKey: false,
  transform: (_doc, ret) => {
    delete ret._id;
    return ret;
  },
});

export const Certification = model('Certification', certificationSchema);
