import { AnswerType } from "../../QuestionVersion/entities/QuestionVersion.entity";

export interface CreateQuestionDto {
  questionText: string;
  answerType: AnswerType;
  options: string[];
}
