import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true }, // stored as "HH:MM" (24hr), simplest & avoids timezone issues
    customerName: { type: String, required: true, trim: true },
    organization: { type: String, trim: true },
    contact: { type: String, trim: true },
    address: { type: String, trim: true },
    requirement: { type: String, trim: true }, // requirement / enquiry
    followUp: {
      type: String,
      enum: ['active', 'following', 'cancelled', 'other'],
      default: 'active'
    },
    remark: { type: String, trim: true, maxlength: 5000 } // employee's statement — can be long, kept readable
  },
  { timestamps: true }
);

leadSchema.index({ employee: 1, date: -1 });

export default mongoose.model('Lead', leadSchema);