import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sets: { type: Number },
    reps: { type: Number },
    weightKg: { type: Number },
  },
  { _id: false }
);

const workoutSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  sessionName: { type: String, required: true },
  duration: { type: Number }, // in minutes
  exercises: [exerciseSchema],
  squatPR: { type: Number, default: null },
  benchPR: { type: Number, default: null },
  deadliftPR: { type: Number, default: null },
  notes: { type: String },
});

const Workout = mongoose.model('Workout', workoutSchema);
export default Workout;
