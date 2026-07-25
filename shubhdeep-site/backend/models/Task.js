import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    dailyGoal: { type: String, trim: true, maxlength: 500 }, // what "done" looks like for this task/day
    description: { type: String, trim: true, maxlength: 2000 },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true, default: Date.now }, // the day this task/goal belongs to
    dueDate: { type: Date },
    priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
    status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
    completedAt: { type: Date, default: null },
    remarks: { type: String, trim: true, maxlength: 1000 }
  },
  { timestamps: true }
);

taskSchema.index({ assignedTo: 1, date: 1 });

taskSchema.pre('save', function (next) {
  if (this.isModified('status')) {
    this.completedAt = this.status === 'completed' ? this.completedAt || new Date() : null;
  }
  next();
});

export default mongoose.model('Task', taskSchema);
