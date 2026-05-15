import { Service } from "typedi";

import { AppDataSource } from "../../../db/db";

import { Quiz } from "../entities/Quiz.entity";

@Service()
export class QuizRepository {
  private readonly repository = AppDataSource.getRepository(Quiz);

  async createQuiz(payload: Partial<Quiz>): Promise<Quiz> {
    const quiz = this.repository.create(payload);

    return this.repository.save(quiz);
  }
  async findQuizByPublicId(publicId: string): Promise<Quiz | null> {
    return this.repository.findOne({
      where: {
        publicId,
      },
    });
  }
  async findQuizDetailsByPublicId(publicId: string): Promise<Quiz | null> {
    return this.repository.findOne({
      where: {
        publicId,
      },

      relations: {
        quizQuestions: {
          question: {
            versions: {
              options: true,
            },
          },
        },
      },
    });
  }
  async findAllQuizzes(): Promise<Quiz[]> {
    return this.repository.find({
      relations: {
        quizQuestions: true,
      },

      order: {
        createdAt: "DESC",
      },
    });
  }
}
