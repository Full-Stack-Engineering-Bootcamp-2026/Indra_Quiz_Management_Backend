import { Service } from "typedi";
import { Repository } from "typeorm";
import AppDataSource from "../../../db/data-source";
import { Example } from "../entities/AttemptAnswerOption.entity";
import { ExampleCreateDto, ExampleUpdateDto } from "../dto/example.dto";

@Service()
export class ExampleRepository {
  private repository: Repository<Example>;

  constructor() {
    this.repository = AppDataSource.getRepository(Example);
  }

  async findAll(): Promise<Example[]> {
    return this.repository.find({ where: { isActive: true } });
  }

  async findById(id: string): Promise<Example | null> {
    return this.repository.findOne({ where: { id, isActive: true } });
  }

  async create(data: ExampleCreateDto): Promise<Example> {
    const item = this.repository.create({ ...data, isActive: true });
    return this.repository.save(item);
  }

  async update(id: string, data: ExampleUpdateDto): Promise<Example | null> {
    await this.repository.update(id, { ...data, updatedAt: new Date() });
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.update(id, { isActive: false, updatedAt: new Date() });
    return (result.affected ?? 0) > 0;
  }
}
