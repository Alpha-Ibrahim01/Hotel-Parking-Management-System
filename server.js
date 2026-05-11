const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 1. MySQL Connection
// APNA PASSWORD YAHAN LIKHEIN (Agar password nahi hai toh khali '' chordein)
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin', 
    database: 'hotel_db'
});

db.connect(err => {
    if (err) {
        console.error("❌ Database connection failed: " + err.message);
        return;
    }
    console.log("✅ MySQL Connected!");
});

// 2. LOGIN API (MySQL Based)
app.post('/book-slot', (req, res) => {
    const { roomNo, date, time } = req.body;

    // 1. Pehle check karein ke room exist karta hai aur uski category kya hai
    db.query('SELECT category, is_booked FROM rooms WHERE room_no = ?', [roomNo], (err, result) => {
        if (err) return res.status(500).send(err);
        
        if (result.length === 0) return res.json({ message: "Room not found" });

        if (result[0].is_booked) {
            return res.json({ message: "Already Booked", status: "full" });
        }

        const category = result[0].category; // Room ki category (Chief/VIP/etc.)

        // 2. Room update karein aur user_category ke saath record save karein
        const updateRoom = 'UPDATE rooms SET is_booked = TRUE WHERE room_no = ?';
        const insertBooking = 'INSERT INTO bookings (room_no, booking_date, booking_time, user_category) VALUES (?, ?, ?, ?)';

        db.query(updateRoom, [roomNo], (err) => {
            if (err) return res.status(500).send(err);
            
            db.query(insertBooking, [roomNo, date, time, category], (err) => {
                if (err) return res.status(500).send(err);
                res.json({ message: "Success" });
            });
        });
    });
});
// 3. AVAILABILITY API (Live from Database)
app.get('/availability', (req, res) => {
    // Ye query confirm karegi ke humein har category ka count mile
    const sql = `
        SELECT category, COUNT(*) as count 
        FROM rooms 
        WHERE is_booked = 0 
        GROUP BY category`;
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Query Error:", err);
            return res.status(500).json({ message: "Database error" });
        }
        // Results ko console mein print karein taake terminal mein dikhe data aa raha hai
        console.log("Availability Data:", results); 
        res.json(results);
    });
});

// 4. BOOK SLOT API (Saves to Bookings table & Updates Room)
app.post('/book-slot', (req, res) => {
    const { roomNo, date, time } = req.body;

    // Check if already booked
    db.query('SELECT is_booked FROM rooms WHERE room_no = ?', [roomNo], (err, result) => {
        if (err) return res.status(500).send(err);
        
        if (result.length > 0 && result[0].is_booked) {
            return res.json({ message: "Already Booked", status: "full" });
        }

        const updateRoom = 'UPDATE rooms SET is_booked = TRUE WHERE room_no = ?';
        const insertBooking = 'INSERT INTO bookings (room_no, booking_date, booking_time) VALUES (?, ?, ?)';

        db.query(updateRoom, [roomNo], (err) => {
            if (err) return res.status(500).send(err);
            db.query(insertBooking, [roomNo, date, time], (err) => {
                if (err) return res.status(500).send(err);
                res.json({ message: "Success" });
            });
        });
    });
});

// 5. GET ALL BOOKINGS (For your record)
app.get("/bookings", (req, res) => {
    db.query('SELECT * FROM bookings', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// SERVER START
app.listen(5000, () => {
    console.log("🚀 Server running on http://localhost:5000");
});