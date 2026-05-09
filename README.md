

# HOTEL DAYS INN PARKING MANAGEMENT SYSTEM

A web-based hotel parking and room booking management system developed using **Node.js, Express, MySQL, HTML, CSS, and JavaScript**. The system helps hotel management handle room availability, bookings, and customer records efficiently with real-time database synchronization.

## How To Compile
- git clone [Github Link](https://github.com/Alpha-Ibrahim01/Hotel-Parking-Management-System.git)
cd hotel-booking-system
- Database Setup
- Open MySQL Workbench.
- Create a database named hotel_db.
- Run the following SQL commands to setup tables:
- Navigate to the backend folder.
- Install dependencies:
- "npm install express mysql2 cors body-parser"
- Open server.js and update your MySQL credentials:
- const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'YOUR_MYSQL_PASSWORD',
    database: 'hotel_db'
});
- Start the Server
Run the following command in your terminal:
- node server.js
- Launch the Frontend
Simply open login.html or app.html in any web browser.

## Features

* Real-time room availability tracking
* Categorized room management (Chief, VIP, Normal, Disabled)
* Secure booking system
* Automated booking records and logs
* Interactive dashboard for admins and customers
* Prevention of double booking
* Database-driven reporting system

## Problem Solved

Traditional manual booking systems caused:

* Human errors in record keeping
* Overbooking issues
* Slow customer service
* Difficulty generating reports

This project automates the process and provides a centralized management system for hotel operations.

## Technologies Used

| Technology        | Purpose                 |
| ----------------- | ----------------------- |
| MySQL             | Database Management     |
| Node.js & Express | Backend Development     |
| JavaScript (ES6+) | Frontend Logic          |
| HTML5 & CSS3      | User Interface          |
| MySQL Workbench   | Database Design         |
| DevDb             | ERD Creation            |
| VS Code           | Development Environment |
| NPM               | Dependency Management   |

## Database Structure

### Rooms Table

| Field     | Type        | Constraint    |
| --------- | ----------- | ------------- |
| room_no   | INT         | Primary Key   |
| category  | VARCHAR(50) | NOT NULL      |
| is_booked | BOOLEAN     | DEFAULT FALSE |

### Bookings Table

| Field         | Type        | Constraint                  |
| ------------- | ----------- | --------------------------- |
| id            | INT         | Primary Key, Auto Increment |
| room_no       | INT         | Foreign Key                 |
| booking_date  | DATE        | NOT NULL                    |
| booking_time  | TIME        | NOT NULL                    |
| user_category | VARCHAR(50) | For Reporting               |

## Important SQL Queries

### Check Available Rooms

```sql
SELECT category, COUNT(*)
FROM rooms
WHERE is_booked = 0
GROUP BY category;
```

### Add New Booking

```sql
INSERT INTO bookings
(room_no, booking_date, booking_time, user_category)
VALUES (?, ?, ?, ?);
```

### Lock Room After Booking

```sql
UPDATE rooms
SET is_booked = 1
WHERE room_no = ?;
```

## System Modules

* Homepage
* Login System
* Dashboard
* Booking Management
* Reports Section
* Database Connectivity

## Challenges Faced

* MySQL authentication and connection issues
* API data fetching problems
* Preventing concurrent double bookings
* Handling CORS policy restrictions

## Future Improvements

* Online payment integration
* Customer feedback system
* Email/SMS booking notifications
* Advanced analytics dashboard
* Mobile responsive interface



## Project Objective

The main objective of this project is to provide an efficient, automated, and user-friendly hotel parking and room management solution that improves booking accuracy and operational efficiency.
