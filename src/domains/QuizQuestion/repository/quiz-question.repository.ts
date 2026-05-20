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

  async removeQuestionFromQuiz(
    quizId: number,
    questionId: number,
  ): Promise<void> {
    await this.repository.delete({
      quiz: {
        id: quizId,
      },

      question: {
        id: questionId,
      },
    });
  }
  async findQuizQuestionsByQuizId(quizId: number) {
    return this.repository.find({
      where: {
        quiz: {
          id: quizId,
        },
      },

      relations: ["question"],
    });
  }

  async removeQuizQuestions(quizQuestions: QuizQuestion[]) {
    return this.repository.remove(quizQuestions);
  }
  async findQuizQuestionByQuestionId(questionId: number) {
    return this.repository.findOne({
      where: {
        question: {
          id: questionId,
        },
      },
    });
  }
}
