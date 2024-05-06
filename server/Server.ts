// Import necessary modules
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Initialize Express app
const app = express();
app.use(express.json());

var cors = require('cors')
app.use(cors())

// Connect to MongoDB
const PORT = process.env.PORT || 5000;

mongoose.connect("mongodb+srv://someshshirpe123:lXUi1Pq3lkjHXmBX@cluster0.vkg5hee.mongodb.net/demo")
  .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
  .catch((error) => console.error(error.message));

// Define User schema
interface UserDocument extends mongoose.Document {
  username: string;
  password: string;
}

const userSchema = new mongoose.Schema<UserDocument>({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

// Define User model
const User = mongoose.model<UserDocument>('User', userSchema);

// Signup endpoint
// Signup endpoint
app.post('/signup', async (req: Request, res: Response) => {
    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
  
      // Create new user
      const user = new User({
        username: req.body.username,
        password: hashedPassword
      });
  
      // Save user to database
      await user.save();
  
      res.status(201).json({ message: 'User created successfully' });
    } catch (err: any) { // Asserting type of 'err' as 'any'
      res.status(500).json({ error: err.message });
    }
  });
  
  // Signin endpoint
  app.post('/signin', async (req: Request, res: Response) => {
  console.log(req.body.username)
    try {
      // Find user by username
      const user = await User.findOne({ username: req.body.username });
  
      // Check if user exists
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Compare passwords
      const passwordMatch = await bcrypt.compare(req.body.password, user.password);
  
      // If passwords match, generate JWT token
      if (passwordMatch) {
        const token = jwt.sign({ username: user.username }, 'secretKey');
        return res.status(200).json({ token });
      } else {
        return res.status(401).json({ message: 'Invalid password' });
      }
    } catch (err: any) { // Asserting type of 'err' as 'any'
      res.status(500).json({ error: err.message });
    }
  });
  
