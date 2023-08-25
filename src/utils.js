const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const PRIVATE_KEY = "CoderKeyOmeprazol";

const createhash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

const isValidPassword = (user, password) => {
  return bcrypt.compareSync(password, user.password);
};

//Generador de token
const generateToken = (user) => {
  const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: "24h" });

  return token;
};

//Extrae token del header
const authToken = (req, res, next) => {
  const authHeader = req.headers.auth;

  if (!authHeader) {
    return res.status(401).send({ error401: "Not auth" });
  }

  const token = authHeader;
  jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
    if (error) {
      return res.status(403).send({ error403: "Not authroized" });
    }

    req.user = credentials.user;
    next();
  });
};

module.exports = {
  createhash,
  isValidPassword,
  generateToken,
  authToken,
};
