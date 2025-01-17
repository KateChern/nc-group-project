const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv").config();
const port = process.env.PORT || 9000;
const app = express();
const colors = require("colors");
const cookieSession = require("cookie-session");
const {
  errorHandler,
  handleCustomErrors,
} = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");
// const port = Math.floor(Math.random() * 10000);
const authJwt = require("./middleware/jwt");

const corsConfig = {
  origin: true,
  credentials: true,
};

app.use(cors(corsConfig));
app.options("*", cors(corsConfig));
app.use(
  cookieSession({
    name: "nc-session",
    secret: "COOKIE_SECRET", // should use as secret environment variable
    httpOnly: true,
  })
);
// const cookieParser = require("cookie-parser");
// app.use(cookieParser());

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept,  x-access-token"
  );

  next();
});
// app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/users", [authJwt.verifyToken], require("./routes/userRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));

app.use("/api/visits", require("./routes/visitsRoutes"));
// app.use("/api/visits", [authJwt.verifyToken], require("./routes/visitsRoutes"));
app.use("/api", require("./routes/endpointsRoutes"));

app.use(handleCustomErrors);
app.use(errorHandler);

app.all("/*", (req, res) => {
  res.status(404).send({ message: "Path not found" });
});

app.listen(port, () => console.log(`Server started on port ${port}`));
module.exports = app;
