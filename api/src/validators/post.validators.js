import { body, param } from 'express-validator';

const createPostValidator = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .bail()
        .isLength({ min: 3, max: 60})
        .withMessage("Title must be between 3 and 60 characters"),
    body("content")
        .trim()
        .notEmpty()
        .withMessage("Content is required")
        .bail()
        .isLength({ min: 6, max: 10000 })
        .withMessage("Content must be between 6 and 10,000 characters long")
        .bail(),
]

const updatePostValidator = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .bail()
        .isLength({ min: 3, max: 60})
        .withMessage("Title must be between 3 and 60 characters"),
    body("content")
        .trim()
        .notEmpty()
        .withMessage("Content is required")
        .bail()
        .isLength({ min: 6, max: 10000 })
        .withMessage("Content must be between 6 and 10,000 characters long")
        .bail(),
];

const postIdParamValidator = [
    param("id")
        .trim()
        .notEmpty()
        .withMessage("Post ID is required")
        .bail()
        .isInt({ gt: 0 })
        .withMessage("Post ID must be a positive integer")
        .bail(),
]

export { createPostValidator, updatePostValidator, postIdParamValidator };