import { Service } from "typedi";

import { AppDataSource } from "../../../db/db";

import { Question } from "../entities/question.entity";
import { QuestionVersion } from "../../QuestionVersion/entities/QuestionVersion.entity";
import { In } from "typeorm";

@Service()
export class QuestionRepository {
  private readonly repository = AppDataSource.getRepository(Question);

  async createQuestion(payload: Partial<Question>): Promise<Question> {
    const question = this.repository.create(payload);

    return this.repository.save(question);
  }

  async findAllQuestions(): Promise<Question[]> {
    return this.repository.find({
      where: {
        isDeleted: false,
        versions: {
          isActive: true,
        },
      },

      relations: {
        versions: {
          options: true,
        },
      },

      order: {
        createdAt: "DESC",
        versions: {
          versionNumber: "DESC",
        },
      },
    });
  }
  async findQuestionByPublicId(publicId: string): Promise<Question | null> {
    return this.repository.findOne({
      where: {
        publicId,
        isDeleted: false,
      },

      relations: {
        versions: {
          options: true,
        },
      },
    });
  }

  async updateQuestionVersion(
    id: number,
    payload: Partial<QuestionVersion>,
  ): Promise<void> {
    await this.repository.update(id, payload);
  }

  async updateQuestion(id: number, payload: Partial<Question>): Promise<void> {
    await this.repository.update(id, payload);
  }

  async findQuestionsByPublicIds(publicIds: string[]): Promise<Question[]> {
    return this.repository.find({
      where: {
        publicId: In(publicIds),
        isDeleted: false,
      },
    });
  }

  async findQuestionWithActiveVersion(
    publicId: string,
  ): Promise<Question | null> {
    return this.repository.findOne({
      where: {
        publicId,
        isDeleted: false,
        versions: {
          isActive: true,
        },
      },

      relations: {
        versions: {
          options: true,
        },
      },
    });
  }
}
