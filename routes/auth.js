const User = require("../models/user");

const express = require("express");
const { body } = require("express-validator");

const authController = require("../controllers/auth");

const router = express.Router();

router.put(
    "/signup",
    [
        body("email")
            .isEmail()
            .withMessage("Please enter a valid email.")
            .custom(async (input, { req }) => {
                const userDoc = await User.findOne({ email: input });
                if (userDoc) {
                    return Promise.reject("Email already exists.");
                }
            })
            .normalizeEmail(),
        body("password", "Password should be at least 5 characters long.")
            .trim()
            .isLength({ min: 5 }),
        body("name", "Required input.").trim().notEmpty(),
    ],
    authController.signup
);

router.post("/login", authController.login);

module.exports = router;
