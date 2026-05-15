import { Request, Response } from "express";
import { Service } from "typedi";
import { success } from "../../../Http_Response/response";
import { QuizService } from "../service/quiz.service";
import { AuthRequest } from "../../../common/interfaces/auth-request.interface";
import { HttpStatus } from "../../../common/constants/http-status.constants";

@Service()
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  public createQuiz = async (
    req: AuthRequest,
    res: Response,
  ): Promise<void> => {
    const result = await this.quizService.createQuiz(
      req.body,
      req.user!.userId,
    );

    res
      .status(HttpStatus.CREATED)
      .json(success(result, "Quiz created successfully"));
  };
  public addQuestionsToQuiz = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const result = await this.quizService.addQuestionsToQuiz(
      req.params.quizPublicId as string,
      req.body,
    );

    res
      .status(200)
      .json(success(result, "Questions added to quiz successfully"));
  };

  public getQuizDetails = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const result = await this.quizService.getQuizDetails(
      req.params.quizPublicId as string,
    );

    res.status(200).json(success(result, "Quiz fetched successfully"));
  };
  public getAllQuizzes = async (req: Request, res: Response): Promise<void> => {
    const result = await this.quizService.getAllQuizzes();

    res
      .status(HttpStatus.OK)
      .json(success(result, "Quizzes fetched successfully"));
  };
  public startQuizAttempt = async (
    req: AuthRequest,
    res: Response,
  ): Promise<void> => {
    const result = await this.quizService.startQuizAttempt(
      req.params.quizPublicId as string,
      req.user!.userId,
    );

    res
      .status(HttpStatus.CREATED)
      .json(success(result, "Quiz started successfully"));
  };

  public submitQuizAnswers = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const result = await this.quizService.submitQuizAnswers(
      req.params.attemptPublicId as string,
      req.body,
    );

    res
      .status(HttpStatus.OK)
      .json(success(result, "Quiz submitted successfully"));
  };

  public getAttemptDetails = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const result = await this.quizService.getAttemptDetails(
      req.params.attemptPublicId as string,
    );

    res.status(200).json(success(result, "Attempt fetched successfully"));
  };

  public getMyAttempts = async (
    req: AuthRequest,
    res: Response,
  ): Promise<void> => {
    const result = await this.quizService.getMyAttempts(req.user!.userId);

    res
      .status(HttpStatus.OK)
      .json(success(result, "Attempt history fetched successfully"));
  };
}
