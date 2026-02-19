const express = require("express");
const cors = require("cors");
const feedRoutes = require("./routes/feedRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/feeds", feedRoutes);

// Health check
app.get("/health", (_req, res) => res.json({ status: "ok" }));

module.exports = app;
