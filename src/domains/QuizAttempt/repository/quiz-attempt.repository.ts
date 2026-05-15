import { Service } from "typedi";

import { AppDataSource } from "../../../db/db";

import { QuizAttempt } from "../entities/QuizAttempt.entity";

@Service()
export class QuizAttemptRepository {
  private readonly repository = AppDataSource.getRepository(QuizAttempt);

  async createAttempt(payload: Partial<QuizAttempt>): Promise<QuizAttempt> {
    const attempt = this.repository.create(payload);

    return this.repository.save(attempt);
  }

  async countUserQuizAttempts(userId: number, quizId: number): Promise<number> {
    return this.repository.count({
      where: {
        user: {
          id: userId,
        },

        quiz: {
          id: quizId,
        },
      },
    });
  }

  async findAttemptByPublicId(publicId: string): Promise<QuizAttempt | null> {
    return this.repository.findOne({
      where: {
        publicId,
      },
    });
  }

  async findAttemptDetailsByPublicId(
    publicId: string,
  ): Promise<QuizAttempt | null> {
    return this.repository.findOne({
      where: {
        publicId,
      },

      relations: {
        quiz: true,

        answers: {
          question: true,

          questionVersion: true,

          selectedOptions: {
            questionOption: true,
          },
        },
      },
    });
  }

  async findUserAttempts(userId: number): Promise<QuizAttempt[]> {
    return this.repository.find({
      where: {
        user: {
          id: userId,
        },
      },

      relations: {
        quiz: true,
      },

      order: {
        submittedAt: "DESC",
      },
    });
  }
}
