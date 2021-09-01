const baseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');


const extension = (joi) => {

    return {
        type: 'string',
        base: joi.string(),
        messages: {
            'string.escapeHtml': '{{#label}} must not include HTML'
        },

        rules: {
            escapeHtml:{
                validate(value, helpers){
                    const clean = sanitizeHtml(value, {
                        allowedTags: [],
                        allowedAttributes: {}
                    });

                    if (value !== clean) {
                        return helpers.error('string.escapeHtml', {value});
                    }
                    return value;       // Value is valid
                }
            }
        }
    };
};


const Joi = baseJoi.extend(extension);

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required().escapeHtml(),
        location: Joi.string().required().escapeHtml(),
        description: Joi.string().required().escapeHtml(),
        // image: Joi.string().required(),
        price: Joi.number().min(0).required()
    }).required(),
    deleteImages: Joi.array()
}).required();


module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        body: Joi.string().required().escapeHtml(),
        rating: Joi.number().min(0).max(5).required()
    }).required()
}).required();