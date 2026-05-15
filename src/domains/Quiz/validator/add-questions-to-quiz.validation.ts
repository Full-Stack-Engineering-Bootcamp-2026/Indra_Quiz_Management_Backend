import Joi from "joi";

export const addQuestionsToQuizValidationSchema = Joi.object({
  questionPublicIds: Joi.array().items(Joi.string().uuid()).min(1).required(),
});
