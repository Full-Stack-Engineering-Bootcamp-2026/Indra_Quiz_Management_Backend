import Joi from "joi";

export const createQuizValidationSchema = Joi.object({
  title: Joi.string().min(3).max(200).required(),
});
