/* eslint-disable max-len */
import Joi from 'joi';

const userSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
});


export default userSchema;