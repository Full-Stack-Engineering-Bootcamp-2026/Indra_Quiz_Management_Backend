import { Service } from "typedi";
import { CreateQuizDto } from "../dto/create-quiz.dto";
import { QuizRepository } from "../repository/quiz.repository";
import { UserRepository } from "../../User/repository/user.repository";
import { NotFoundException } from "../../../common/exceptions";
import { QuestionRepository } from "../../Question/repository/question.repository";

import { QuizQuestionRepository } from "../../QuizQuestion/repository/quiz-question.repository";

import { AddQuestionsToQuizDto } from "../dto/add-questions-to-quiz.dto";
import { QuizAttemptRepository } from "../../QuizAttempt/repository/quiz-attempt.repository";
import { AttemptAnswerOptionRepository } from "../../AttemptAnswerOption/repository/attempt-answer-option.repository";
import { AttemptAnswerRepository } from "../../AttemptAnswer/repository/attempt-answer.repository";
import { QuestionOptionRepository } from "../../QuestionOption/repository/question-option.repository";
import { SubmitQuizDto } from "../../QuizAttempt/validator/submit-quiz.dto";

@Service()
export class QuizService {
  constructor(
    private readonly quizRepository: QuizRepository,
    private readonly attemptAnswerRepository: AttemptAnswerRepository,

    private readonly attemptAnswerOptionRepository: AttemptAnswerOptionRepository,

    private readonly questionOptionRepository: QuestionOptionRepository,

    private readonly userRepository: UserRepository,

    private readonly questionRepository: QuestionRepository,

    private readonly quizQuestionRepository: QuizQuestionRepository,
    private readonly quizAttemptRepository: QuizAttemptRepository,
  ) {}

  async createQuiz(payload: CreateQuizDto, userId: number) {
    const { title } = payload;

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const quiz = await this.quizRepository.createQuiz({
      title,
      createdBy: user,
    });

    return {
      publicId: quiz.publicId,
      title: quiz.title,
    };
  }

  async addQuestionsToQuiz(
    quizPublicId: string,
    payload: AddQuestionsToQuizDto,
  ) {
    const { questionPublicIds } = payload;

    const quiz = await this.quizRepository.findQuizByPublicId(quizPublicId);

    if (!quiz) {
      throw new NotFoundException("Quiz not found");
    }

    const questions =
      await this.questionRepository.findQuestionsByPublicIds(questionPublicIds);

    if (questions.length !== questionPublicIds.length) {
      throw new NotFoundException("One or more questions not found");
    }

    const quizQuestions = await this.quizQuestionRepository.createQuizQuestions(
      questions.map((question) => ({
        quiz,
        question,
      })),
    );

    return {
      quizPublicId: quiz.publicId,

      questions: quizQuestions.map((quizQuestion) => ({
        publicId: quizQuestion.question.publicId,
      })),
    };
  }

  async getQuizDetails(publicId: string) {
    const quiz = await this.quizRepository.findQuizDetailsByPublicId(publicId);

    if (!quiz) {
      throw new NotFoundException("Quiz not found");
    }

    return {
      publicId: quiz.publicId,

      title: quiz.title,

      questions: quiz.quizQuestions.map((quizQuestion) => {
        const activeVersion = quizQuestion.question.versions.find(
          (version) => version.isActive,
        );

        return {
          publicId: quizQuestion.question.publicId,

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
      }),
    };
  }

  async getAllQuizzes() {
    const quizzes = await this.quizRepository.findAllQuizzes();

    return quizzes.map((quiz) => ({
      publicId: quiz.publicId,

      title: quiz.title,

      totalQuestions: quiz.quizQuestions.length,

      createdAt: quiz.createdAt,
    }));
  }

  async startQuizAttempt(quizPublicId: string, userId: number) {
    const quiz = await this.quizRepository.findQuizByPublicId(quizPublicId);

    if (!quiz) {
      throw new NotFoundException("Quiz not found");
    }

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const previousAttempts =
      await this.quizAttemptRepository.countUserQuizAttempts(user.id, quiz.id);

    const attempt = await this.quizAttemptRepository.createAttempt({
      user,
      quiz,
      attemptNumber: previousAttempts + 1,
    });

    return {
      attemptPublicId: attempt.publicId,
      quizPublicId: quiz.publicId,
      attemptNumber: attempt.attemptNumber,
    };
  }

  async submitQuizAnswers(attemptPublicId: string, payload: SubmitQuizDto) {
    const attempt =
      await this.quizAttemptRepository.findAttemptByPublicId(attemptPublicId);

    if (!attempt) {
      throw new NotFoundException("Quiz attempt not found");
    }

    for (const answerData of payload.answers) {
      const question =
        await this.questionRepository.findQuestionWithActiveVersion(
          answerData.questionPublicId,
        );

      if (!question) {
        throw new NotFoundException("Question not found");
      }

      const activeVersion = question.versions.find(
        (version) => version.isActive,
      );

      if (!activeVersion) {
        throw new NotFoundException("Active question version not found");
      }

      const attemptAnswer =
        await this.attemptAnswerRepository.createAttemptAnswer({
          attempt,
          question,
          questionVersion: activeVersion,
          answerText: answerData.answerText,
        });

      if (
        answerData.selectedOptionPublicIds &&
        answerData.selectedOptionPublicIds.length > 0
      ) {
        const selectedOptions =
          await this.questionOptionRepository.findOptionsByPublicIds(
            answerData.selectedOptionPublicIds,
          );

        await this.attemptAnswerOptionRepository.createSelectedOptions(
          selectedOptions.map((option) => ({
            attemptAnswer,
            questionOption: option,
          })),
        );
      }
    }

    return {
      attemptPublicId: attempt.publicId,
      submittedAnswers: payload.answers.length,
    };
  }

  async getAttemptDetails(attemptPublicId: string) {
    const attempt =
      await this.quizAttemptRepository.findAttemptDetailsByPublicId(
        attemptPublicId,
      );

    if (!attempt) {
      throw new NotFoundException("Quiz attempt not found");
    }

    return {
      attemptPublicId: attempt.publicId,

      attemptNumber: attempt.attemptNumber,

      submittedAt: attempt.submittedAt,

      quiz: {
        publicId: attempt.quiz.publicId,
        title: attempt.quiz.title,
      },

      answers: attempt.answers.map((answer) => ({
        questionPublicId: answer.question.publicId,

        questionText: answer.questionVersion.questionText,

        versionNumber: answer.questionVersion.versionNumber,

        answerType: answer.questionVersion.answerType,

        answerText: answer.answerText,

        selectedOptions: answer.selectedOptions.map((selectedOption) => ({
          publicId: selectedOption.questionOption.publicId,

          optionText: selectedOption.questionOption.optionText,
        })),
      })),
    };
  }

  async getMyAttempts(userId: number) {
    const attempts = await this.quizAttemptRepository.findUserAttempts(userId);

    return attempts.map((attempt) => ({
      attemptPublicId: attempt.publicId,

      attemptNumber: attempt.attemptNumber,

      submittedAt: attempt.submittedAt,

      quiz: {
        publicId: attempt.quiz.publicId,
        title: attempt.quiz.title,
      },
    }));
  }
}
