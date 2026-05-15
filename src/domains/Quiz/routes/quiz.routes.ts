import { Router } from "express";
import { Service } from "typedi";
import { QuizController } from "../controller/quiz.controller";
import { authenticate } from "../../../common/middleware/authenticate.middleware";
import { requireRole } from "../../../common/middleware/authorize.middleware";
import { validate } from "../../../common/middleware/validate.middleware";
import { UserRole } from "../../User/entities/user.entity";
import { createQuizValidationSchema } from "../validator/create-quiz.validation";
import { addQuestionsToQuizValidationSchema } from "../validator/add-questions-to-quiz.validation";
import { submitQuizValidationSchema } from "../../QuizQuestion/dto/submit-quiz.validation";
@Service()
export class QuizRoutes {
  public router: Router;

  constructor(private readonly quizController: QuizController) {
    this.router = Router();

    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      "/",
      authenticate,
      requireRole(UserRole.ADMIN),
      validate(createQuizValidationSchema),
      this.quizController.createQuiz,
    );

    this.router.post(
      "/:quizPublicId/questions",
      authenticate,
      requireRole(UserRole.ADMIN),
      validate(addQuestionsToQuizValidationSchema),
      this.quizController.addQuestionsToQuiz,
    );
    this.router.get(
      "/:quizPublicId",
      authenticate,
      this.quizController.getQuizDetails,
    );
    this.router.get("/", authenticate, this.quizController.getAllQuizzes);

    this.router.post(
      "/:quizPublicId/start",
      authenticate,
      this.quizController.startQuizAttempt,
    );

    this.router.post(
      "/attempts/:attemptPublicId/submit",
      authenticate,
      validate(submitQuizValidationSchema),
      this.quizController.submitQuizAnswers,
    );

    this.router.get(
      "/attempts/my-attempts",
      authenticate,
      this.quizController.getMyAttempts,
    );

    this.router.get(
      "/attempts/:attemptPublicId",
      authenticate,
      this.quizController.getAttemptDetails,
    );
  }
}
