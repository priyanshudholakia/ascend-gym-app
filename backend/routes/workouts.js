import express from 'express';
import Workout from '../models/Workout.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET /api/workouts/my — get all workouts for current user
router.get('/my', protect, async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(workouts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/workouts/prs — get highest PRs for current user
router.get('/prs', protect, async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.user.id });

    let squatPR = null;
    let benchPR = null;
    let deadliftPR = null;

    for (const w of workouts) {
      if (w.squatPR !== null && w.squatPR !== undefined) {
        squatPR = squatPR === null ? w.squatPR : Math.max(squatPR, w.squatPR);
      }
      if (w.benchPR !== null && w.benchPR !== undefined) {
        benchPR = benchPR === null ? w.benchPR : Math.max(benchPR, w.benchPR);
      }
      if (w.deadliftPR !== null && w.deadliftPR !== undefined) {
        deadliftPR = deadliftPR === null ? w.deadliftPR : Math.max(deadliftPR, w.deadliftPR);
      }
    }

    res.json({ squatPR, benchPR, deadliftPR });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/workouts — create a new workout
router.post('/', protect, async (req, res) => {
  try {
    const { sessionName, duration, exercises, squatPR, benchPR, deadliftPR, notes } = req.body;

    if (!sessionName) {
      return res.status(400).json({ message: 'Session name is required' });
    }

    const workout = await Workout.create({
      userId: req.user.id,
      sessionName,
      duration: duration || null,
      exercises: exercises || [],
      squatPR: squatPR || null,
      benchPR: benchPR || null,
      deadliftPR: deadliftPR || null,
      notes: notes || '',
    });

    res.status(201).json(workout);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/workouts/:id — delete a workout (only owner)
router.delete('/:id', protect, async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    if (workout.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this workout' });
    }
    await workout.deleteOne();
    res.json({ message: 'Workout deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
