import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    icon: { type: String, default: '&lt;/&gt;', trim: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    desc: { type: String, required: true, trim: true, maxlength: 400 },
    feats: [{ type: String, trim: true }],
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

serviceSchema.index({ order: 1 });

export default mongoose.model('Service', serviceSchema);