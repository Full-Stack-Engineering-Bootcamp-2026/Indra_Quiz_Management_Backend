import { Service } from "typedi";

import { AppDataSource } from "../../../db/db";

import { AttemptAnswer } from "../entities/AttemptAnswer.entity";

@Service()
export class AttemptAnswerRepository {
  private readonly repository = AppDataSource.getRepository(AttemptAnswer);

  async createAttemptAnswer(
    payload: Partial<AttemptAnswer>,
  ): Promise<AttemptAnswer> {
    const answer = this.repository.create(payload);

    return this.repository.save(answer);
  }
}
