import Joi from 'joi';

const cartSchema = Joi.object({
    userId: Joi.number().required(),
    productId: Joi.number().required(),
    quantity: Joi.number().min(1).required(),
});

export default cartSchema;