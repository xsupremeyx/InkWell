import { body } from 'express-validator';

const validateRegister = [
    body("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required")
        .bail()
        .isLength({ min: 3, max: 30})
        .withMessage("Username must be between 3 and 30 characters")
        .matches(/^[A-Za-z0-9_]+$/)
        .withMessage("Username can only contain letters, numbers, and underscores")
        .bail(),
    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .bail()
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long")
        .bail(),
]

const validateLogin = [
    body("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required.")
        .bail(),

    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required.")
        .bail(),
];

export { validateRegister, validateLogin };