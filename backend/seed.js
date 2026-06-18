import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Workout from './models/Workout.js';

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Workout.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create staff account
    const staff = await User.create({
      name: 'Alex Staff',
      email: 'staff@ascend.com',
      password: 'staff123',
      role: 'staff',
      phone: '+91-9000000001',
    });
    console.log('👤 Staff created:', staff.email);

    // Helper: days from now
    const daysFromNow = (days) => {
      const d = new Date();
      d.setDate(d.getDate() + days);
      return d;
    };

    // Create member accounts
    const priyanshu = await User.create({
      name: 'Priyanshu Dholakia',
      email: 'member@ascend.com',
      password: 'member123',
      role: 'member',
      membershipStatus: 'active',
      membershipExpiry: daysFromNow(180),
      phone: '+91-9876543210',
    });

    const riya = await User.create({
      name: 'Riya Mehta',
      email: 'riya@ascend.com',
      password: 'member123',
      role: 'member',
      membershipStatus: 'expiring',
      membershipExpiry: daysFromNow(10),
      phone: '+91-9876543211',
    });

    const arjun = await User.create({
      name: 'Arjun Singh',
      email: 'arjun@ascend.com',
      password: 'member123',
      role: 'member',
      membershipStatus: 'expired',
      membershipExpiry: daysFromNow(-30),
      phone: '+91-9876543212',
    });

    const neha = await User.create({
      name: 'Neha Kapoor',
      email: 'neha@ascend.com',
      password: 'member123',
      role: 'member',
      membershipStatus: 'active',
      membershipExpiry: daysFromNow(90),
      phone: '+91-9876543213',
    });

    console.log('👥 Members created: Priyanshu, Riya, Arjun, Neha');

    // Create workouts for Priyanshu
    const workouts = [
      {
        userId: priyanshu._id,
        date: daysFromNow(-1),
        sessionName: 'Push Day',
        duration: 75,
        exercises: [
          { name: 'Bench Press', sets: 4, reps: 8, weightKg: 90 },
          { name: 'Overhead Press', sets: 3, reps: 10, weightKg: 60 },
          { name: 'Incline Dumbbell Press', sets: 3, reps: 12, weightKg: 35 },
          { name: 'Tricep Pushdowns', sets: 3, reps: 15, weightKg: 30 },
        ],
        benchPR: 95,
        notes: 'Hit a new bench PR today! Feeling strong.',
      },
      {
        userId: priyanshu._id,
        date: daysFromNow(-3),
        sessionName: 'Leg Day',
        duration: 90,
        exercises: [
          { name: 'Back Squat', sets: 5, reps: 5, weightKg: 140 },
          { name: 'Romanian Deadlift', sets: 4, reps: 8, weightKg: 100 },
          { name: 'Leg Press', sets: 3, reps: 12, weightKg: 180 },
          { name: 'Walking Lunges', sets: 3, reps: 20, weightKg: 20 },
          { name: 'Calf Raises', sets: 4, reps: 15, weightKg: 60 },
        ],
        squatPR: 140,
        notes: 'New squat PR! 140kg felt solid.',
      },
      {
        userId: priyanshu._id,
        date: daysFromNow(-6),
        sessionName: 'Pull Day',
        duration: 80,
        exercises: [
          { name: 'Deadlift', sets: 4, reps: 4, weightKg: 180 },
          { name: 'Barbell Rows', sets: 4, reps: 8, weightKg: 90 },
          { name: 'Pull-ups', sets: 3, reps: 10, weightKg: 0 },
          { name: 'Face Pulls', sets: 3, reps: 15, weightKg: 25 },
          { name: 'Bicep Curls', sets: 3, reps: 12, weightKg: 20 },
        ],
        deadliftPR: 180,
        notes: 'Deadlift PR at 180kg!',
      },
      {
        userId: priyanshu._id,
        date: daysFromNow(-10),
        sessionName: 'Upper Body',
        duration: 65,
        exercises: [
          { name: 'Bench Press', sets: 4, reps: 8, weightKg: 85 },
          { name: 'Barbell Rows', sets: 4, reps: 8, weightKg: 85 },
          { name: 'Shoulder Press', sets: 3, reps: 10, weightKg: 55 },
          { name: 'Lat Pulldowns', sets: 3, reps: 12, weightKg: 65 },
        ],
        notes: 'Solid session, focusing on form.',
      },
      {
        userId: priyanshu._id,
        date: daysFromNow(-14),
        sessionName: 'Leg Day',
        duration: 85,
        exercises: [
          { name: 'Back Squat', sets: 5, reps: 5, weightKg: 130 },
          { name: 'Leg Press', sets: 3, reps: 12, weightKg: 160 },
          { name: 'Hack Squat', sets: 3, reps: 10, weightKg: 80 },
          { name: 'Leg Curls', sets: 3, reps: 12, weightKg: 45 },
        ],
        notes: 'Working up to the new squat goal.',
      },
      {
        userId: priyanshu._id,
        date: daysFromNow(-18),
        sessionName: 'Full Body',
        duration: 95,
        exercises: [
          { name: 'Back Squat', sets: 3, reps: 8, weightKg: 120 },
          { name: 'Bench Press', sets: 3, reps: 8, weightKg: 80 },
          { name: 'Deadlift', sets: 3, reps: 5, weightKg: 160 },
          { name: 'Pull-ups', sets: 3, reps: 8, weightKg: 0 },
          { name: 'Plank', sets: 3, reps: 1, weightKg: 0 },
        ],
        notes: 'Back to basics — full body session.',
      },
    ];

    for (const w of workouts) {
      await Workout.create(w);
    }

    console.log('💪 6 workout sessions created for Priyanshu');
    console.log('\n✅ Seed complete! Demo credentials:');
    console.log('   Staff:  staff@ascend.com  / staff123');
    console.log('   Member: member@ascend.com / member123');
    console.log('   Member: riya@ascend.com   / member123');
    console.log('   Member: arjun@ascend.com  / member123');
    console.log('   Member: neha@ascend.com   / member123');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seed();
