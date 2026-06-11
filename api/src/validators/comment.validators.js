import { body, param } from 'express-validator';

const commentContentValidator = [
    body("content")
        .trim()
        .notEmpty()
        .withMessage("Content is required")
        .bail()
        .isLength({ max: 1000 })
        .withMessage("Content must be less than 1000 characters long")
        .bail(),
]

const commentIdParamValidator = [
    param("id")
        .trim()
        .notEmpty()
        .withMessage("Comment ID is required")
        .bail()
        .isInt({ gt: 0 })
        .withMessage("Comment ID must be a positive integer")
        .bail(),
]

export { commentContentValidator, commentIdParamValidator };

