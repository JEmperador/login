const { Router } = require("express");
const router = Router();
const passport = require("passport");

router.post("/login", passport.authenticate("login", "/"), async (req, res) => {
  if (!req.user) return res.status(400).send("Invalid credentials");
  req.session.user = req.user;

  return res.redirect("/profile");
});

router.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/",
  }),
  async (req, res) => {
    return res.redirect("/");
  }
);

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.json({ message: err });
    }
    res.redirect("/");
  });
});

module.exports = router;
