import { Service } from "typedi";

import { AppDataSource } from "../../../db/db";

import { QuizQuestion } from "../entities/QuizQuestion.entity";

@Service()
export class QuizQuestionRepository {
  private readonly repository = AppDataSource.getRepository(QuizQuestion);

  async createQuizQuestions(
    payload: Partial<QuizQuestion>[],
  ): Promise<QuizQuestion[]> {
    const quizQuestions = this.repository.create(payload);

    return this.repository.save(quizQuestions);
  }
}
