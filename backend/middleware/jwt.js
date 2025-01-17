const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();

verifyToken = (req, res, next) => {
  let token = req.session.token;
  // let token = req.cookies["x-access-token"];
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }
  jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};

const authJwt = {
  verifyToken,
  // isAdmin,
  // isModerator,
};
module.exports = authJwt;
