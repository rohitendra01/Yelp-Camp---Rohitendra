const BaseJoi = require('joi');
const sanitizeHTML = require('sanitize-html');

const extension = (joi) =>({
  type : 'string',
  base : joi.string(),
  messages : {
    'string.escapeHTML' : '{{#label}} must not include HTML!'
  },
  rules : {
    escapeHTML : {
      validate(value, helpers){
        const clean = sanitization(value,{
          allowedTags : [],
          allowedAttributes : {},
        });
        if(clean != value) 
          return helpers.error('string.escapeHTML', {value})
        return clean;
      }
    }
  }
});


const Joi = BaseJoi.extend(extension);

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
      title: Joi.string().required(),
      price: Joi.number().required().min(0),
      location: Joi.string().required(),
      description: Joi.string().required()
    }).required(),
    deleteImages : Joi.array()
  });


module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating : Joi.number().required(),
    body : Joi.string().required()
  }).required()
});