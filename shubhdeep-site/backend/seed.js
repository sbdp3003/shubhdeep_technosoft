// Run `npm run seed` to create the first admin account (and two sample employees + tasks).
import 'dotenv/config';
import connectDB from './config/db.js';
import User from './models/User.js';
import Task from './models/Task.js';
import Attendance from './models/Attendance.js';

const run = async () => {
  await connectDB();

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@shubhdeeptechnosoft.com';
  const existingAdmin = await User.findOne({ email: adminEmail });

  let admin = existingAdmin;
  if (!existingAdmin) {
    admin = await User.create({
      name: process.env.ADMIN_NAME || 'Admin',
      email: adminEmail,
      password: process.env.ADMIN_PASSWORD || 'Admin@12345',
      role: 'admin',
      position: 'Administrator',
      department: 'Management'
    });
    console.log(`Admin created: ${adminEmail} / ${process.env.ADMIN_PASSWORD || 'Admin@12345'}`);
  } else {
    console.log(`Admin already exists: ${adminEmail}`);
  }

  // Sample employees (only created if they don't already exist)
  const sampleEmployees = [
    { name: 'Arjun Mehta', email: 'arjun@shubhdeeptechnosoft.com', password: 'Employee@123', phone: '+91 98765 11111', position: 'Full-Stack Developer', department: 'Engineering' },
    { name: 'Divya Rao', email: 'divya@shubhdeeptechnosoft.com', password: 'Employee@123', phone: '+91 98765 22222', position: 'UI/UX Designer', department: 'Design' }
  ];

  const employees = [];
  for (const e of sampleEmployees) {
    let emp = await User.findOne({ email: e.email });
    if (!emp) {
      emp = await User.create({ ...e, role: 'employee' });
      console.log(`Employee created: ${e.email} / ${e.password}`);
    }
    employees.push(emp);
  }

  // Sample tasks for today
  const today = new Date();
  const existingTasks = await Task.countDocuments();
  if (existingTasks === 0 && employees.length === 2) {
    await Task.insertMany([
      { title: 'Fix login page validation bug', dailyGoal: 'Bug fixed and deployed to staging', assignedTo: employees[0]._id, assignedBy: admin._id, date: today, priority: 'high', status: 'in-progress' },
      { title: 'Write unit tests for Task API', dailyGoal: '80% coverage on task routes', assignedTo: employees[0]._id, assignedBy: admin._id, date: today, priority: 'medium', status: 'pending' },
      { title: 'Design new dashboard mockups', dailyGoal: '3 mockup screens ready for review', assignedTo: employees[1]._id, assignedBy: admin._id, date: today, priority: 'medium', status: 'completed' }
    ]);
    console.log('Sample tasks created.');
  }

  // Sample attendance for today
  const existingAttendance = await Attendance.countDocuments();
  if (existingAttendance === 0 && employees.length === 2) {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    await Attendance.insertMany([
      { employee: employees[0]._id, date: start, status: 'present', markedBy: admin._id },
      { employee: employees[1]._id, date: start, status: 'present', markedBy: admin._id }
    ]);
    console.log('Sample attendance created.');
  }

  console.log('\nSeed complete.');
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
