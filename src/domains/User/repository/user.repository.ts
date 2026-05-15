import { Service } from "typedi";

import { AppDataSource } from "../../../db/db";
import { User } from "../entities/user.entity";

@Service()
export class UserRepository {
  private readonly repository = AppDataSource.getRepository(User);

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({
      where: {
        email,
      },
    });
  }

  async createUser(payload: Partial<User>): Promise<User> {
    const user = this.repository.create(payload);

    return this.repository.save(user);
  }
}
