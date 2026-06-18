import express from 'express';
import User from '../models/User.js';
import Workout from '../models/Workout.js';
import { protect, staffOnly } from '../middleware/auth.js';

const router = express.Router();

// All staff routes require protect + staffOnly
router.use(protect, staffOnly);

// GET /api/staff/members — get all members
router.get('/members', async (req, res) => {
  try {
    const members = await User.find({ role: 'member' })
      .select('name email membershipStatus membershipExpiry joinedAt profileInitials phone')
      .sort({ joinedAt: -1 });
    res.json(members);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/staff/members/:id — get single member profile
router.get('/members/:id', async (req, res) => {
  try {
    const member = await User.findById(req.params.id).select('-password');
    if (!member || member.role !== 'member') {
      return res.status(404).json({ message: 'Member not found' });
    }
    res.json(member);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/staff/members/:id/workouts — get all workouts for a member
router.get('/members/:id/workouts', async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.params.id }).sort({ date: -1 });
    res.json(workouts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/staff/members/:id/membership — update membership status/expiry
router.patch('/members/:id/membership', async (req, res) => {
  try {
    const { membershipStatus, membershipExpiry } = req.body;

    const validStatuses = ['active', 'expiring', 'expired'];
    if (membershipStatus && !validStatuses.includes(membershipStatus)) {
      return res.status(400).json({ message: 'Invalid membership status' });
    }

    const updateData = {};
    if (membershipStatus) updateData.membershipStatus = membershipStatus;
    if (membershipExpiry) updateData.membershipExpiry = new Date(membershipExpiry);

    const member = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.json(member);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
