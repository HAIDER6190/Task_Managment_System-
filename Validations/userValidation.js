const Joi = require("joi");

// Joi Schema for user
const userSchema = Joi.object({
    username: Joi.string()
        .alphanum()
        .pattern(/[0-9]/, "number")
        .pattern(/[a-z]/, "lowercase")
        .min(6)
        .max(20)
        .required()
        .trim(),

    email: Joi.string().email().required(),

    password: Joi.string()
        .min(8)
        .pattern(/[A-Z]/, "uppercase")
        .pattern(/[a-z]/, "lowercase")
        .pattern(/[0-9]/, "number")
        .pattern(/[^a-zA-Z0-9]/, "special character")
        .required(),

    securityQuestion: Joi.string().min(3).max(100).required(),
    answer: Joi.string().min(2).max(100).required()
});


// Schema for updates (password optional)
const updateUserSchema = Joi.object({
    username: Joi.string().alphanum().pattern(/[0-9]/, "number")
        .pattern(/[a-z]/, "lowercase").min(3).max(20).trim(),
    email: Joi.string().email(),
    password: Joi.string()
        .min(8)
        .pattern(/[A-Z]/)
        .pattern(/[a-z]/)
        .pattern(/[0-9]/)
        .pattern(/[^a-zA-Z0-9]/),

    securityQuestion: Joi.string().min(3).max(100).required(),
    answer: Joi.string().min(2).max(100).required()
});

module.exports = { userSchema, updateUserSchema };
