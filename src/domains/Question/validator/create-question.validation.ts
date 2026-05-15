import Joi from "joi";

export const createQuestionValidationSchema = Joi.object({
  questionText: Joi.string().required(),

  answerType: Joi.string()
    .valid("single_select", "multi_select", "text")
    .required(),

  options: Joi.array().items(Joi.string()).required(),
});
