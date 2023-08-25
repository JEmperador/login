const { Router } = require("express");
const router = Router();
const passport = require("passport");

router.get("/", (req, res) => {
  if (req.session?.user) {
    res.redirect("/profile");
  }

  res.render("login", {});
});

router.get("/register", (req, res) => {
  if (req.session?.user) {
    res.redirect("/profile");
  }

  res.render("register", {});
});

function auth(req, res, next) {
  if (req.session?.user) return next();
  res.redirect("/");
}

router.get("/profile", auth, (req, res) => {
  const user = req.session.user;

  res.render("profile", user);
});

router.get(
  "/login-github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/" }),
  async (req, res) => {
    console.log("Callback: ", req.user);
    req.session.user = req.user;
    res.redirect("/profile");
  }
);

module.exports = router;
