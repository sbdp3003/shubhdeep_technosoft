import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true, maxlength: 30 },
    service: { type: String, trim: true, default: 'Other' },
    message: { type: String, required: true, maxlength: 3000 },
    status: { type: String, enum: ['new', 'contacted', 'closed'], default: 'new' },
    emailSent: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model('Contact', contactSchema);