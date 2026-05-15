import { Router } from "express";
import { Service } from "typedi";
import { QuestionController } from "../controller/question.controller";
import { authenticate } from "../../../common/middleware/authenticate.middleware";
import { requireRole } from "../../../common/middleware/authorize.middleware";
import { validate } from "../../../common/middleware/validate.middleware";
import { UserRole } from "../../User/entities/user.entity";
import { createQuestionValidationSchema } from "../validator/create-question.validation";

@Service()
export class QuestionRoutes {
  public router: Router;

  constructor(private readonly questionController: QuestionController) {
    this.router = Router();

    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      "/",
      authenticate,
      requireRole(UserRole.ADMIN),
      validate(createQuestionValidationSchema),
      this.questionController.createQuestion,
    );
    this.router.get("/", authenticate, this.questionController.getAllQuestions);
    this.router.get(
      "/:publicId",
      authenticate,
      this.questionController.getQuestionByPublicId,
    );
    this.router.put(
      "/:publicId",
      authenticate,
      requireRole(UserRole.ADMIN),
      validate(createQuestionValidationSchema),
      this.questionController.updateQuestion,
    );
    this.router.delete(
      "/:publicId",
      authenticate,
      requireRole(UserRole.ADMIN),
      this.questionController.deleteQuestion,
    );
  }
}
