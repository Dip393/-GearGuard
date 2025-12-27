const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorMiddleware");
const equipmentRoutes = require("./routes/equipmentRoutes");
const teamRoutes = require("./routes/teamRoutes");
const requestRoutes = require("./routes/requestRoutes");






const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);


app.use("/api/equipment", equipmentRoutes);

app.use("/api/teams", teamRoutes);

app.use("/api/requests", requestRoutes);

app.get("/", (req, res) => {
  res.json({ message: "GearGuard API running" });
});

app.use(errorHandler);

module.exports = app;
