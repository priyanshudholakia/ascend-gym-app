import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['member', 'staff'], default: 'member' },
  membershipStatus: {
    type: String,
    enum: ['active', 'expiring', 'expired'],
    default: 'active',
  },
  membershipExpiry: { type: Date },
  joinedAt: { type: Date, default: Date.now },
  phone: { type: String },
  profileInitials: { type: String },
});

userSchema.pre('save', async function (next) {
  // Auto-generate initials from name
  if (this.isModified('name') || !this.profileInitials) {
    const parts = this.name.trim().split(' ');
    if (parts.length >= 2) {
      this.profileInitials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    } else {
      this.profileInitials = parts[0].substring(0, 2).toUpperCase();
    }
  }

  // Hash password if modified
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
