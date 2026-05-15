import { Service } from "typedi";

import { AppDataSource } from "../../../db/db";

import { QuestionVersion } from "../entities/QuestionVersion.entity";

@Service()
export class QuestionVersionRepository {
  private readonly repository = AppDataSource.getRepository(QuestionVersion);

  async createQuestionVersion(
    payload: Partial<QuestionVersion>,
  ): Promise<QuestionVersion> {
    const version = this.repository.create(payload);

    return this.repository.save(version);
  }
  async updateQuestionVersion(
    id: number,
    payload: Partial<QuestionVersion>,
  ): Promise<void> {
    await this.repository.update(id, payload);
  }
}
