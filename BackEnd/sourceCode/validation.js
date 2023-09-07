const Joi = require("@hapi/joi");

const registerValidation = data => {
    const Schema = Joi.object({
        firstName: Joi.string().min(2).required(),
        lastName: Joi.string().min(2).required(),
        userName: Joi.string().min(2).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
    });
    return Schema.validate(data);
};

const loginValidation = data => {
    const Schema = Joi.object({
        userName: Joi.string().min(2).required(),
        password: Joi.string().min(6).required(),
    });
    return Schema.validate(data);
};


module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;