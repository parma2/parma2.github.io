const express = require("express");
const passport = require("passport");
const { isLoggedIn } = require("../middleware");
const router = express.Router();

const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");

const usersController = require("../controllers/users");

router.route("/register")
    .get(usersController.renderRegister)
    .post(catchAsync(usersController.register))

router.route("/login")
    .get(usersController.renderLogin)
    .post(
        passport.authenticate("local", { failureFlash: "Username or password is incorrect", failureRedirect: "/login" }),
        usersController.login
    )

router.get("/logout", usersController.logout)

module.exports = router;
