const { Router } = require("express");
const router = Router()
const { generateToken, authToken } = require("../utils");

const usersDB = []

router.post("/register", (req, res) => {
    const user = req.body

    if(usersDB.find(u => u.email === user.email)) {
        return res.status(400).send("User already Exists")
    }

    usersDB.push(user)

    const access_token = generateToken(user)

    res.send({status: "success", access_token})
})

router.get("/current", authToken, (req, res) => {
    res.send({status: "success", payload: req.user})
})

module.exports = router