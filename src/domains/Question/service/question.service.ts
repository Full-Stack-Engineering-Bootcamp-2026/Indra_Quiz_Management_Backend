import { Service } from "typedi";

import { CreateQuestionDto } from "../dto/create-question.dto";

import { QuestionRepository } from "../repository/question.repository";

import { QuestionVersionRepository } from "../../QuestionVersion/repository/question-version.repository";

import { QuestionOptionRepository } from "../../QuestionOption/repository/question-option.repository";

import { UserRepository } from "../../User/repository/user.repository";
import { QuestionOption } from "../../QuestionOption/entities/QuestionOption.entity";
import {
  BadRequestException,
  NotFoundException,
} from "../../../common/exceptions";
import { QuizQuestionRepository } from "../../QuizQuestion/repository/quiz-question.repository";

@Service()
export class QuestionService {
  constructor(
    private readonly questionRepository: QuestionRepository,

    private readonly questionVersionRepository: QuestionVersionRepository,

    private readonly questionOptionRepository: QuestionOptionRepository,

    private readonly userRepository: UserRepository,
    private readonly quizQuestionRepository: QuizQuestionRepository,
  ) {}

  async createQuestion(payload: CreateQuestionDto, userId: number) {
    const { questionText, answerType, options } = payload;

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const question = await this.questionRepository.createQuestion({
      createdBy: user,
    });

    const questionVersion =
      await this.questionVersionRepository.createQuestionVersion({
        question,
        versionNumber: 1,
        questionText,
        answerType,
        isActive: true,
      });

    let createdOptions: QuestionOption[] = [];

    if (options && options.length > 0) {
      createdOptions = await this.questionOptionRepository.createOptions(
        options.map((option) => ({
          optionText: option,
          questionVersion,
        })),
      );
    }

    return {
      publicId: question.publicId,

      version: {
        publicId: questionVersion.publicId,
        versionNumber: questionVersion.versionNumber,
        questionText: questionVersion.questionText,
        answerType: questionVersion.answerType,
        isActive: questionVersion.isActive,
      },

      options: createdOptions.map((option) => ({
        publicId: option.publicId,
        optionText: option.optionText,
      })),
    };
  }

  async getAllQuestions() {
    const questions = await this.questionRepository.findAllQuestions();

    return questions.map((question) => {
      const activeVersion = question.versions.find(
        (version) => version.isActive,
      );

      return {
        publicId: question.publicId,

        version: activeVersion
          ? {
              publicId: activeVersion.publicId,
              versionNumber: activeVersion.versionNumber,
              questionText: activeVersion.questionText,
              answerType: activeVersion.answerType,
            }
          : null,

        options:
          activeVersion?.options.map((option) => ({
            publicId: option.publicId,
            optionText: option.optionText,
          })) || [],
      };
    });
  }

  async getQuestionByPublicId(publicId: string) {
    const question =
      await this.questionRepository.findQuestionByPublicId(publicId);

    if (!question) {
      throw new NotFoundException("Question not found");
    }

    const activeVersion = question.versions.find((version) => version.isActive);

    return {
      publicId: question.publicId,

      version: activeVersion
        ? {
            publicId: activeVersion.publicId,
            versionNumber: activeVersion.versionNumber,
            questionText: activeVersion.questionText,
            answerType: activeVersion.answerType,
          }
        : null,

      options:
        activeVersion?.options.map((option) => ({
          publicId: option.publicId,
          optionText: option.optionText,
        })) || [],
    };
  }

  async updateQuestion(publicId: string, payload: CreateQuestionDto) {
    const { questionText, answerType, options } = payload;

    const question =
      await this.questionRepository.findQuestionByPublicId(publicId);

    if (!question) {
      throw new NotFoundException("Question not found");
    }

    const activeVersion = question.versions.find((version) => version.isActive);

    if (!activeVersion) {
      throw new NotFoundException("Active question version not found");
    }

    await this.questionVersionRepository.updateQuestionVersion(
      activeVersion.id,
      {
        isActive: false,
      },
    );

    const newVersion =
      await this.questionVersionRepository.createQuestionVersion({
        question,
        versionNumber: activeVersion.versionNumber + 1,
        questionText,
        answerType,
        isActive: true,
      });

    const createdOptions = await this.questionOptionRepository.createOptions(
      options.map((option) => ({
        optionText: option,
        questionVersion: newVersion,
      })),
    );

    return {
      publicId: question.publicId,

      version: {
        publicId: newVersion.publicId,
        versionNumber: newVersion.versionNumber,
        questionText: newVersion.questionText,
        answerType: newVersion.answerType,
        isActive: newVersion.isActive,
      },

      options: createdOptions.map((option) => ({
        publicId: option.publicId,
        optionText: option.optionText,
      })),
    };
  }

  async deleteQuestion(publicId: string) {
    const question =
      await this.questionRepository.findQuestionByPublicId(publicId);

    if (!question) {
      throw new NotFoundException("Question not found");
    }

    const quizQuestion =
      await this.quizQuestionRepository.findQuizQuestionByQuestionId(
        question.id,
      );

    if (quizQuestion) {
      throw new BadRequestException(
        "Question is already added to a quiz. Remove it from quiz first.",
      );
    }

    await this.questionRepository.updateQuestion(question.id, {
      isDeleted: true,
    });

    return {
      publicId: question.publicId,
    };
  }
}
