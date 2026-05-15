import { Service } from 'typedi';
import { ExampleRepository } from '../repository/question-option.repository';
import { LoggerService } from '../../../common/utils/logger.service';
import { NotFoundException } from '../../../common/exceptions';
import { ExampleOutDto, ExampleCreateDto, ExampleUpdateDto } from '../dto/example.dto';

@Service()
export class ExampleService {
  constructor(
    private readonly repository: ExampleRepository,
    private readonly logger: LoggerService
  ) { }

  public async getAll(): Promise<ExampleOutDto[]> {
    this.logger.debug('Fetching all examples');
    return this.repository.findAll();
  }

  public async getById(id: string): Promise<ExampleOutDto> {
    this.logger.debug(`Fetching example with ID: ${id}`);
    const item = await this.repository.findById(id);
    if (!item) throw new NotFoundException(`Example with ID ${id} not found`);
    return item;
  }

  public async create(data: ExampleCreateDto): Promise<ExampleOutDto> {
    this.logger.info(`Creating new example: ${data.name}`);
    return this.repository.create(data);
  }

  public async update(id: string, data: ExampleUpdateDto): Promise<ExampleOutDto> {
    this.logger.info(`Updating example: ${id}`);
    const existing = await this.repository.findById(id);
    if (!existing) throw new NotFoundException(`Example with ID ${id} not found`);
    return this.repository.update(id, data) as Promise<ExampleOutDto>;
  }

  public async delete(id: string): Promise<void> {
    this.logger.info(`Deleting example: ${id}`);
    const existing = await this.repository.findById(id);
    if (!existing) throw new NotFoundException(`Example with ID ${id} not found`);
    await this.repository.delete(id);
  }

}
