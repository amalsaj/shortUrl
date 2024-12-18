require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const connectDB = require("./db/db");
const analyticsRouter = require("./route/analyticsRouter");
const urlRouter = require("./route/urlRoute");
const redirectRouter = require("./route/redirectRouter");
const authRouter = require("./route/authRouter");

const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./swaggerConfig");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

connectDB();

// Swagger API docs route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use("/api/analytics", analyticsRouter);
app.use("/api/auth", authRouter);

app.use("/api", urlRouter);

app.use(redirectRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: "Internal Server Error", error: err.message });
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
