const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const handlebars = require("express-handlebars");
const mongoose = require("mongoose");
const sessionRouter = require("./router/session.router");
const viewsRouter = require("./router/views.router");
const initializatePassport = require("./config/passport.config");
const passport = require("passport");
const jwtRouter = require("./router/jwt.router")

const app = express();

const URL =
  "mongodb+srv://j4v1113r:5yH26ge7hKX39K9M@cluster0.esbn95w.mongodb.net/?retryWrites=true&w=majority";

const PORT = process.env.PORT || 8080;

//Config for JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Config handlebars
const hbs = handlebars.create({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
});

app.engine("handlebars", hbs.engine);
app.set("views", "./src/views");
app.set("view engine", "handlebars");

//Config mongo sessions
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: URL,
      dbName: "ecommerce",
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      ttl: 100,
    }),
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

//Config passport
initializatePassport()
app.use(passport.initialize())
app.use(passport.session())

app.get("/health", (req, res) => {
  res.send("HI");
});

//Rutas
app.use("/", viewsRouter);
app.use("/api/session", sessionRouter);
app.use("/jwt", jwtRouter)

app.listen(PORT, (req, res) => {
  console.log(`Server running at port: ${PORT}`);
});

mongoose
  .connect(URL, {
    dbName: "ecommerce",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connected");
  })
  .catch((e) => {
    console.log("Can't connect to DB");
  });
