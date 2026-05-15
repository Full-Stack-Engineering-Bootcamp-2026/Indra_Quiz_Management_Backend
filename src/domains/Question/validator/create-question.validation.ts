import Joi from "joi";

export const createQuestionValidationSchema = Joi.object({
  questionText: Joi.string().required(),

  answerType: Joi.string()
    .valid("single_select", "multi_select", "text")
    .required(),

  options: Joi.when("answerType", {
    is: Joi.valid("single_select", "multi_select"),
    then: Joi.array().items(Joi.string()).min(1).required(),
    otherwise: Joi.forbidden(),
  }),
});
