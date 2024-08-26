const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// MongoDB connection setup
mongoose.connect('mongodb://localhost:27017/restaurant', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define User schema and model
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', UserSchema);

// Function to create a new user
async function createUser(username, password) {
    try {
        // Check if username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            console.log('Username already exists');
            return;
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save new user
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        console.log('User created successfully');
    } catch (error) {
        console.error('Error creating user:', error.message);
    } finally {
        mongoose.connection.close();
    }
}

// Call createUser with sample data
createUser('mirza', 'mirza');
