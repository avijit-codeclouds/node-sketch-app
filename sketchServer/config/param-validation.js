// const Joi = require('joi');
const { validate, ValidationError, Joi } = require('express-validation')

module.exports = {
  // POST /api/users
  createUser: {
    body: {
      username: Joi.string().required(),
      mobileNumber: Joi.string()
        .regex(/^[1-9][0-9]{9}$/)
        .required()
    }
  },
  // UPDATE /api/users/:userId
  updateUser: {
    body: {
      email: Joi.string()
        .regex(/[\w]+?@[\w]+?\.[a-z]{2,4}/)
        .required(),
      fist_name: Joi.string(),
      last_name: Joi.string()
    },
    params: {
      userId: Joi.string()
        .hex()
        .required()
    }
  },

  // POST /api/auth/login
  login: {
    body: {
      email: Joi.string().required(),
      password: Joi.string().required()
    }
  }
};
