var express = require("express");
var router = express.Router();
let User = require("../models/user.model");
let bcrypt = require("bcrypt");
let Auth = require("../auth");
const jwt = require("jsonwebtoken");

router.post("/login", async function (req, res, next) {
  User.findOne({ email: req.body.email })
    .lean()
    .then(async (response) => {
      // Compare Password
      if (bcrypt.compareSync(req.body.password, response.password)) {
        response.token = await jwt.sign(
          { userId: response._id, email: response.email },
          "secret",
          {
            expiresIn: "1d",
          }
        );
        res.status(200).json({ data: response });
      } else {
        res.status(200).json({ error: "Invalid Login Data" });
      }
    })
    .catch((error) => {
      console.log(error);
      res.json({ message: error.message });
    });
});
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

module.exports = router;
