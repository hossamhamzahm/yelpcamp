const Joi = require('joi');

module.exports.campgroundSchema = Joi.object({
    title: Joi.string().required(),
    location: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required(),
    price: Joi.number().min(0).required()
}).required();