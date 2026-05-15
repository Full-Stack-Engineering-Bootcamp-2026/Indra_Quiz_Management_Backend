import { Service } from "typedi";

import { AppDataSource } from "../../../db/db";

import { QuestionOption } from "../entities/QuestionOption.entity";

@Service()
export class QuestionOptionRepository {
  private readonly repository = AppDataSource.getRepository(QuestionOption);

  async createOptions(
    payload: Partial<QuestionOption>[],
  ): Promise<QuestionOption[]> {
    const options = this.repository.create(payload);

    return this.repository.save(options);
  }
}
