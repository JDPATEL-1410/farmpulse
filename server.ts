
/**
 * BACKEND ARCHITECTURE BLUEPRINT
 * Tech Stack: Node.js, Express, MongoDB Atlas, Passport.js, JWT, Bcrypt
 * 
 * This file contains the complete logic for the production-grade backend.
 */

/*
import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET = "FARM_PULSE_SECURE_JWT_SECRET_2025_ATLAS";
const MONGO_URI = "mongodb+srv://JD1410:jdpatel1410@cluster0.pcsjosu.mongodb.net/FarmPulse?appName=Cluster0";

// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// --- DATABASE MODELS ---
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['ADMIN', 'MANAGER'], default: 'ADMIN' }
});

const FarmSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  location: String,
  areaSize: Number,
  season: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Farm = mongoose.model('Farm', FarmSchema);

// --- PASSPORT JWT STRATEGY ---
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET
};

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    const user = await User.findById(jwt_payload.id);
    if (user) return done(null, user);
    return done(null, false);
  } catch (err) {
    return done(err, false);
  }
}));

// --- AUTH ROUTES ---

// Registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: "Identity conflict." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, role });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id, username: newUser.username }, SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: newUser._id, username, role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials." });

    const token = jwt.sign({ id: user._id, username: user.username }, SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Password Reset
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { username, newPassword } = req.body;
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ username }, { password: hashedPassword });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- PROTECTED DATA ROUTES ---

app.get('/api/farms', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const farms = await Farm.find({ userId: req.user.id });
  res.json(farms);
});

app.post('/api/farms', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const farm = new Farm({ ...req.body, userId: req.user.id });
  await farm.save();
  res.status(201).json(farm);
});

// --- SERVER START ---
mongoose.connect(MONGO_URI).then(() => {
  console.log('✅ DATABASE SYNCED: CLUSTER0');
  app.listen(PORT, () => console.log(`🚀 API SERVER RUNNING ON PORT ${PORT}`));
}).catch(err => console.error("❌ ATLAS CONNECTION FAILED", err));
*/
