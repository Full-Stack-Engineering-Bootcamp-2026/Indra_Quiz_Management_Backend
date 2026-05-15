import { Service } from "typedi";

import { AppDataSource } from "../../../db/db";

import { QuestionOption } from "../entities/QuestionOption.entity";
import { In } from "typeorm";

@Service()
export class QuestionOptionRepository {
  private readonly repository = AppDataSource.getRepository(QuestionOption);

  async createOptions(
    payload: Partial<QuestionOption>[],
  ): Promise<QuestionOption[]> {
    const options = this.repository.create(payload);

    return this.repository.save(options);
  }

  async findOptionsByPublicIds(publicIds: string[]): Promise<QuestionOption[]> {
    return this.repository.find({
      where: {
        publicId: In(publicIds),
      },
    });
  }
}
