const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const taskRoutes = require("./routes/taskRoutes");
app.use("/api/tasks", taskRoutes);


const app = express();
app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB error:", err));

app.get("/", (req, res) => res.send("API is working 🚀"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
