const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv").config();
const port = process.env.PORT || 9000;
const app = express();
const colors = require("colors");
const {
  errorHandler,
  handleCustomErrors,
} = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");

// const port = Math.floor(Math.random() * 10000);
const authJwt = require("./middleware/jwt");

// const corsOptions = {
//   origin: "http://localhost:5000",
// };
app.use(cors());

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, Content-Type, Accept,  x-access-token"
  );
  next();
});
app.use("/api/users", [authJwt.verifyToken], require("./routes/userRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));

app.use("/api/visits", [authJwt.verifyToken], require("./routes/visitsRoutes"));
app.use("/api", require("./routes/endpointsRoutes"));

app.use(handleCustomErrors);
app.use(errorHandler);

app.all("/*", (req, res) => {
  res.status(404).send({ message: "Path not found" });
});

app.listen(port, () => console.log(`Server started on port ${port}`));
module.exports = app;
