const Joi = require("joi");

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(20).required().label("Name"),
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().min(8).required().label("Password"),
  });

  return schema.validate(user);
}

exports.validateUser = validateUser;
