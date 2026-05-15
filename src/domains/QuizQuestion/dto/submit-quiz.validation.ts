import Joi from "joi";

export const submitQuizValidationSchema = Joi.object({
  answers: Joi.array()
    .items(
      Joi.object({
        questionPublicId: Joi.string().uuid().required(),

        selectedOptionPublicIds: Joi.array().items(Joi.string().uuid()),

        answerText: Joi.string(),
      }),
    )
    .min(1)
    .required(),
});
