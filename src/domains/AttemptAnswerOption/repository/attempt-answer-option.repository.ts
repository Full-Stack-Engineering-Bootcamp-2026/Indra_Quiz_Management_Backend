import { Service } from "typedi";

import { AppDataSource } from "../../../db/db";

import { AttemptAnswerOption } from "../entities/AttemptAnswerOption.entity";

@Service()
export class AttemptAnswerOptionRepository {
  private readonly repository =
    AppDataSource.getRepository(AttemptAnswerOption);

  async createSelectedOptions(
    payload: Partial<AttemptAnswerOption>[],
  ): Promise<AttemptAnswerOption[]> {
    const options = this.repository.create(payload);

    return this.repository.save(options);
  }
}
