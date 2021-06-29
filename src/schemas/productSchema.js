import Joi from 'joi';

const productSchema = Joi.object({
    name: Joi.string().min(1).required(),
    value: Joi.number().min(1).required(),
    description: Joi.string().min(1).required(),
    image: Joi.string().uri().required()
});

export default productSchema;