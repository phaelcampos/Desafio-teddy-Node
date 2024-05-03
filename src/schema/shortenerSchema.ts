/* eslint-disable max-len */
import Joi from 'joi';

const shortenerSchema = Joi.object({
    link: Joi.string().required(),
});


export default shortenerSchema;