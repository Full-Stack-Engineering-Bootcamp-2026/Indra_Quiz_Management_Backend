export interface SubmitQuizDto {
  answers: {
    questionPublicId: string;

    selectedOptionPublicIds?: string[];

    answerText?: string;
  }[];
}
