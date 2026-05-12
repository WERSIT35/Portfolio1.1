import { Schema, model } from 'mongoose';

const metricSchema = new Schema(
  { label: { type: String, required: true }, value: { type: String, required: true } },
  { _id: false }
);

const projectSchema = new Schema(
  {
    projName: { type: String, required: true },
    subname: { type: String, default: '' },
    date: { type: String, default: '' },
    about: { type: String, default: '' },
    numOfPage: { type: Number, default: 0 },
    duration: { type: String, default: '' },
    img: { type: [String], default: [] },
    link: { type: String, default: '' },
    github: { type: String, default: '' },
    iflink: { type: Boolean, default: false },
    gradient: { type: String, default: '' },
    highlights: { type: [String], default: undefined },

    role: { type: String },
    year: { type: Number },
    status: { type: String, enum: ['live', 'in-production', 'archived', 'private'] },
    featured: { type: Boolean },
    problem: { type: String },
    approach: { type: [String] },
    metrics: { type: [metricSchema], default: undefined },
    lessons: { type: String },
    demoEmbedUrl: { type: String },
    stack: { type: [String] },

    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

projectSchema.set('toJSON', {
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = String(ret._id);
    delete ret._id;
    return ret;
  },
});

export const Project = model('Project', projectSchema);
