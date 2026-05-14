import { Router } from 'express';
import { Service } from 'typedi';
import { ExampleController } from '../controller/example.controller';
import { authenticate } from '../../../common/middleware/authenticate.middleware';
import { validate } from '../../../common/middleware/validate.middleware';
import { asyncHandler } from '../../../common/utils/async-handler';
import { createExampleSchema, updateExampleSchema } from '../validator/example.validator';

@Service()
export class ExampleRoutes {
  public router: Router;

  constructor(
    private readonly controller: ExampleController,
  ) {
    this.router = Router();
    this.addRoutes();
  }

  public getRoutes(): Router {
    return this.router;
  }

  private addRoutes(): void {
    this.router.get('/', authenticate, asyncHandler(this.controller.getAll.bind(this.controller)));
    this.router.get('/:id', authenticate, asyncHandler(this.controller.getById.bind(this.controller)));
    this.router.post('/', authenticate, validate(createExampleSchema), asyncHandler(this.controller.create.bind(this.controller)));
    this.router.put('/:id', authenticate, validate(updateExampleSchema), asyncHandler(this.controller.update.bind(this.controller)));
    this.router.delete('/:id', asyncHandler(this.controller.delete.bind(this.controller)));
  }
}
