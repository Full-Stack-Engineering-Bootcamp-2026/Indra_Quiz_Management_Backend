import { Request, Response } from "express";

import { Service } from "typedi";

import { success } from "../../../Http_Response/response";

import { QuestionService } from "../service/question.service";

import { AuthRequest } from "../../../common/interfaces/auth-request.interface";
import { HttpStatus } from "../../../common/constants/http-status.constants";

interface GetQuestionParams {
  publicId: string;
}

@Service()
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  public createQuestion = async (
    req: AuthRequest,
    res: Response,
  ): Promise<void> => {
    const result = await this.questionService.createQuestion(
      req.body,
      req.user!.userId,
    );

    res
      .status(HttpStatus.CREATED)
      .json(success(result, "Question created successfully"));
  };

  public getAllQuestions = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const result = await this.questionService.getAllQuestions();

    res.status(200).json(success(result, "Questions fetched successfully"));
  };

  public getQuestionByPublicId = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const param: string = req.params.publicId as string;
    const result = await this.questionService.getQuestionByPublicId(param);

    res.status(200).json(success(result, "Question fetched successfully"));
  };
  public updateQuestion = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const result = await this.questionService.updateQuestion(
      req.params.publicId as string,
      req.body,
    );

    res
      .status(HttpStatus.OK)
      .json(success(result, "Question updated successfully"));
  };

  public deleteQuestion = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const result = await this.questionService.deleteQuestion(
      req.params.publicId as string,
    );

    res.status(200).json(success(result, "Question deleted successfully"));
  };
}
