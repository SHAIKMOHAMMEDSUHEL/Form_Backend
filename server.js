const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "back",
  password: "9849",
  port: 5432,
});

// POST Course Data
app.post("/api/courses", async (req, res) => {
  try {
    console.log("Received data:", req.body);
    const { courseId, courseName, courseCategory, department, courseCoordinator, courseChampion, caiaCoordinator } = req.body;
    
    const query = `
      INSERT INTO courses (courseId, courseName, courseCategory, department, courseCoordinator, courseChampion, caiaCoordinator)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
    const values = [courseId, courseName, courseCategory, department, courseCoordinator, courseChampion, caiaCoordinator];

    const result = await pool.query(query, values);
    
    console.log("Insert result:", result.rows);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Database error:", error.message);
    res.status(500).json({ error: "Database Error" });
  }
});


// GET Latest Course Data
// GET All Courses
app.get("/api/courses", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM courses ORDER BY id DESC");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Database error:", error.message);
    res.status(500).json({ error: "Database Error" });
  }
});


app.listen(5001, () => {
  console.log("Server running on port 5001");
});
