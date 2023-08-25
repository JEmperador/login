const passport = require("passport");
const local = require("passport-local");
const github = require("passport-github2");
const UserModel = require("../models/user.model");
const { createhash, isValidPassword } = require("../utils");

const LocalStrategy = local.Strategy;
const GitHubStrategy = github.Strategy;

const clientIdGitHub = "Iv1.304110cce54f0e69";
const clientSecretGitHub = "da2b638959c4ad907723f7728a1fa9d3183af831";
const callbackUrlGitHub = "http://localhost:8080/githubcallback";

//App ID: 377127
//Client ID: Iv1.304110cce54f0e69
//secret: da2b638959c4ad907723f7728a1fa9d3183af831

const initializatePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
          const user = await UserModel.findOne({ email: username });
          if (user) {
            console.log("User already exists");
            return done(null, false);
          }

          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createhash(password),
          };

          if (email === "adminCoder@coder.com") {
            newUser.rol = "admin";
          } else {
            newUser.rol = "usuario";
          }

          const result = await UserModel.create(newUser);
          return done(null, false);
        } catch (err) {
          return done(`Error: ${err}`);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await UserModel.findOne({ email: username });

          if (!user) {
            console.log("User doesn't exist");
            return done(null, false);
          }

          if (!isValidPassword(user, password)) {
            console.log("Password not valid");
            return done(null, false);
          }

          return done(null, user);
        } catch (err) {
          return done(`Error: ${err}`);
        }
      }
    )
  );

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: clientIdGitHub,
        clientSecret: clientSecretGitHub,
        callbackURL: callbackUrlGitHub,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile._json.email;
          const fullName = profile._json.name.split(" ");
          const name = fullName[0];
          const lastName = fullName[1];

          const user = await UserModel.findOne({ email: email });

          if (user) {
            console.log(`User already exists ${email}`);
            return done(null, user);
          }

          const newUser = {
            first_name: name,
            last_name: lastName,
            email: email,
            password: "",
          };
          const result = await UserModel.create(newUser);

          return done(null, result);
        } catch (err) {
          return done(`Error: ${err}`);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await UserModel.findById(id);
    done(null, user);
  });
};

module.exports = initializatePassport;
