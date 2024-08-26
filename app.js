const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcrypt');
const app = express();

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.set('view engine', 'ejs');
// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/restaurant', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

//////////////////////// Define schemas and models

// Feedback schema
const FeedbackSchema = new mongoose.Schema({
    name: String,
    email: String,
    feedback: String,
    date: { type: Date, default: Date.now }
});
const Feedback = mongoose.model('Feedback', FeedbackSchema);

// Reservation schema
const ReservationSchema = new mongoose.Schema({
    reservationId: { type: Number, required: true, unique: true },
    name: String,
    email: String,
    phone: String,
    date: Date,
    time: String,
    guests: Number,
    requests: String
});
const Reservation = mongoose.model('Reservation', ReservationSchema);

// User schema and model
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', UserSchema);

app.post('/submit-feedback', (req, res) => {
    const { name, email, feedback, date } = req.body;
    const newFeedback = new Feedback({ name, email, feedback, date });

    newFeedback.save()
        .then(() => res.render('success'))
        .catch(err => res.status(500).send(`Error submitting feedback: ${err.message}`));
});

app.get('/feedback', (req, res) => {
    Feedback.find()
        .then(feedbackData => res.render('feedback', { feedbacks: feedbackData }))
        .catch(err => res.status(500).send(`Error fetching feedback: ${err.message}`));
});

app.get('/reserveTable', (req, res) => {
    res.render('reserveTable');
});

let reservationCounter = 1;
app.post('/submit-reservation', (req, res) => {
    const { name, email, phone, date, time, guests, requests } = req.body;
    const newReservation = new Reservation({
        reservationId: reservationCounter++,
        name, email, phone, date, time, guests, requests
    });

    newReservation.save()
        .then(() => res.render('success'))
        .catch(err => res.status(500).send(`Error submitting reservation: ${err.message}`));
});

app.get('/reservationHistory', (req, res) => {
    Reservation.find()
        .then(data => res.render('reservationHistory', { reservations: data }))
        .catch(err => res.status(500).send(`Error fetching reservations: ${err.message}`));
});

app.get('/edit-reservation/:id', (req, res) => {
    const { id } = req.params;
    Reservation.findById(id)
        .then(reservation => res.render('editReservation', { reservation }))
        .catch(err => res.status(500).send(`Error retrieving reservation: ${err.message}`));
});

app.post('/edit-reservation/:id', (req, res) => {
    const { id } = req.params;
    const { name, email, phone, date, time, guests, requests } = req.body;

    Reservation.findByIdAndUpdate(id, { name, email, phone, date, time, guests, requests })
        .then(() => res.send('Reservation updated successfully'))
        .catch(err => res.status(500).send(`Error updating reservation: ${err.message}`));
});

app.post('/delete-reservation/:id', (req, res) => {
    const { id } = req.params;
    Reservation.findByIdAndDelete(id)
        .then(() => res.redirect('/reservationHistory'))
        .catch(err => res.status(500).send(`Error deleting reservation: ${err.message}`));
});


// Serve static files and start server
app.use(express.static(path.join(__dirname, 'public')));
app.listen(3000, () => console.log('Server is listening on port 3000...'));

// login authentication
app.post('/adminPanel', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if user exists in database
        const user = await User.findOne({ username });

        if (user) {
            // Compare passwords
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                // Authentication successful, set session
                req.session.user = user;
                res.redirect('/adminPanel');
            } else {
                res.send('Invalid username or password');
            }
        } else {
            res.send('User not found');
        }
    } catch (error) {
        res.status(500).send(`Error during login: ${error.message}`);
    }
});


// Staff Schema
const StaffSchema = new mongoose.Schema({
    name: String,
    role: String,
    salary: { type: Number, required: true }
});

const Staff = mongoose.model('Staff', StaffSchema);

app.post('/addStaff', (req, res) => {
    const { staffName, staffRole, staffSalary } = req.body;

    // Parse salary to number
    const parsedSalary = parseInt(staffSalary);

    // Validate parsed salary
    if (isNaN(parsedSalary)) {
        return res.status(400).send('Invalid salary value');
    }

    // Create new staff member
    const newStaff = new Staff({
        name: staffName,
        role: staffRole,
        salary: parsedSalary
    });

    // Save to database
    newStaff.save()
        .then(() => {
            console.log('Staff added successfully');
            res.redirect('/staff');
        })
        .catch(err => {
            console.error(`Error adding staff: ${err.message}`);
            res.status(500).send(`Error adding staff: ${err.message}`);
        });
});



// Route to display staff
app.get('/staff', (req, res) => {
    Staff.find()
        .then(staffData => {
            // Debug log to see fetched staff data
            console.log("Fetched Staff Data:", staffData);

            const staffByRole = staffData.reduce((acc, staffMember) => {
                const role = staffMember.role;
                if (!acc[role]) {
                    acc[role] = [];
                }
                acc[role].push(staffMember);
                return acc;
            }, {});

            const staff = Object.keys(staffByRole).map(role => ({
                role,
                members: staffByRole[role]
            }));

            // Debug log to see processed staff data
            console.log("Processed Staff Data:", staff);

            res.render('staff', { staff });
        })
        .catch(err => res.status(500).send(`Error fetching staff: ${err.message}`));
});
// delete staff
app.post('/deleteStaff', async (req, res) => {
    const { id } = req.body;

    try {
        const deletedStaff = await Staff.findByIdAndDelete(id);

        if (!deletedStaff) {
            return res.status(404).send('Staff member not found');
        }

        res.redirect('/staff');
    } catch (error) {
        res.status(500).send(`Error deleting staff: ${error.message}`);
    }
});
app.get('/editStaff/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const staff = await Staff.findById(id);
        if (!staff) {
            return res.status(404).send('Staff member not found');
        }
        res.render('editStaff', { staff });
    } catch (error) {
        res.status(500).send(`Error retrieving staff: ${error.message}`);
    }
});
app.post('/editStaff/:id', async (req, res) => {
    const { id } = req.params;
    const { editStaffName, staffRole, editStaffSalary } = req.body;

    try {
        const updatedStaff = await Staff.findByIdAndUpdate(id, {
            name: editStaffName,
            role: staffRole,
            salary: editStaffSalary
        }, { new: true });

        if (!updatedStaff) {
            return res.status(404).send('Staff member not found');
        }

        res.redirect('/staff');
    } catch (error) {
        res.status(500).send(`Error updating staff: ${error.message}`);
    }
});


app.get('/adminPanel', async (req, res) => {
    try {
        const reservationCount = await Reservation.countDocuments();
        const feedbackCount = await Feedback.countDocuments();
        const staffCount = await Staff.countDocuments();

        res.render('adminPanel', { reservationCount, feedbackCount, staffCount });
    } catch (error) {
        res.status(500).send(`Error fetching data: ${error.message}`);
    }
});


/////////////////////////////////////// PATH
app.get('/', (req, res) => {
    res.render('index')
});

app.get('/menu', (req, res) => {
    res.render('menu')
});

app.get('/burgers', (req, res) => {
    res.render('burgers')
});

app.get('/chicken', (req, res) => {
    res.render('chicken')
});

app.get('/soup', (req, res) => {
    res.render('soup')
});

app.get('/pizza', (req, res) => {
    res.render('pizza')
});

app.get('/desserts', (req, res) => {
    res.render('desserts')
});

app.get('/sandwich', (req, res) => {
    res.render('sandwich')
});

app.get('/seafood', (req, res) => {
    res.render('seafood')
});

app.get('/beverages', (req, res) => {
    res.render('beverages')
});

app.get('/reserveTable', (req, res) => {
    res.render('reserveTable')
});

app.get('/adminLogin', (req, res) => {
    res.render('adminLogin')
});

app.get('/adminPanel', (req, res) => {
    res.render('adminPanel')
});

app.get('/orderHistory', (req, res) => {
    res.render('orderHistory')
});

app.get('/reservationHistory', (req, res) => {
    res.render('reservationHistory')
});

app.get('/staff', (req, res) => {
    res.render('staff')
});

app.get('/inventory', (req, res) => {
    res.render('inventory')
});

app.get('/feedback', (req, res) => {
    res.render('feedback')
});

app.get('/form', (req, res) => {
    res.render('form');
});

app.get('*', (req, res) => {
    res.render('pageNotFound')
});

