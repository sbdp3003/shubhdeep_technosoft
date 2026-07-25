// import mongoose from 'mongoose';

// const attendanceSchema = new mongoose.Schema(
//   {
//     employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     date: { type: Date, required: true },
//     status: { type: String, enum: ['present', 'absent', 'half-day', 'leave'], default: 'present' },
//     markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//     note: { type: String, trim: true, maxlength: 300 }
//   },
//   { timestamps: true }
// );

// // One attendance record per employee per day
// attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

// export default mongoose.model('Attendance', attendanceSchema);



import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['present', 'absent', 'half-day', 'leave'], default: 'present' },
    checkIn: { type: Date, default: null },
    checkOut: { type: Date, default: null },
    markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    note: { type: String, trim: true, maxlength: 300 }
  },
  { timestamps: true }
);

attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

export default mongoose.model('Attendance', attendanceSchema);