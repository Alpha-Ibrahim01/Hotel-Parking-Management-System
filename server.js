const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

// CORS ko configure kiya taake Port 5500 se connection accept ho
app.use(cors({
    origin: "*", // Sabhi ports allow kar diye testing ke liye
    methods: ["GET", "POST"]
}));

app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin', 
    database: 'hotel_db'
});

db.connect(err => {
    if (err) {
        console.error("❌ DB Error: " + err.message);
        return;
    }
    console.log("✅ MySQL Connected!");
});

// LOGIN ROUTE
app.post('/login', (req, res) => {
    const { roomNo } = req.body;
    db.query('SELECT * FROM rooms WHERE room_no = ?', [roomNo], (err, results) => {
        if (err) return res.status(500).json({ message: "DB Error" });
        if (results.length > 0) {
            res.json({ user: true });
        } else {
            res.json({ user: false, message: "Room not found!" });
        }
    });
});

// AVAILABILITY ROUTE
app.get('/availability', (req, res) => {
    const sql = `SELECT category, COUNT(*) as count FROM rooms WHERE is_booked = 0 GROUP BY category`;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ message: "DB Error" });
        res.json(results);
    });
});

// BOOKING ROUTE (Updates both tables)
app.post('/book-slot', (req, res) => {
    const { roomNo, date, time } = req.body;
    db.query('SELECT category, is_booked FROM rooms WHERE room_no = ?', [roomNo], (err, result) => {
        if (err || result.length === 0) return res.status(500).json({ message: "Room error" });
        if (result[0].is_booked) return res.json({ message: "Already Booked", status: "full" });

        const category = result[0].category;
        db.query('UPDATE rooms SET is_booked = TRUE WHERE room_no = ?', [roomNo], (err) => {
            if (err) return res.status(500).json({ message: "Update failed" });
            db.query('INSERT INTO bookings (room_no, booking_date, booking_time, user_category) VALUES (?, ?, ?, ?)', 
            [roomNo, date, time, category], (err) => {
                if (err) return res.status(500).json({ message: "Booking failed" });
                res.json({ message: "Success" });
            });
        });
    });
});

app.listen(5000, () => console.log("🚀 Server: http://localhost:5000"));