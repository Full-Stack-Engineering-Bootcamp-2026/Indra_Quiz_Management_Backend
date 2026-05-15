import express, {
  Application as ExpressApp,
  Request,
  Response,
  Router,
} from "express";

import dotenv from "dotenv";
import cors from "cors";
import "reflect-metadata";

import Container from "typedi";

import { AppDataSource } from "./db/db";

import { success } from "./Http_Response/response";

import {
  errorHandler,
  notFoundHandler,
} from "./common/middleware/error-handler.middleware";

import { UserRoutes } from "./domains/User/routes/user.routes";
import { QuestionRoutes } from "./domains/Question/routes/question.routes";
import { QuizRoutes } from "./domains/Quiz/routes/quiz.routes";

dotenv.config();

class Application {
  public app: ExpressApp;

  private readonly port: number;

  constructor() {
    this.app = express();

    this.port = parseInt(process.env.PORT || "3000", 10);

    this.initializeMiddleware();

    this.initializeRoutes();

    this.initializeErrorHandling();
  }

  private initializeMiddleware(): void {
    const allowedOrigins = (
      process.env.ALLOWED_ORIGINS || "http://localhost:5173"
    ).split(",");

    this.app.use(
      cors({
        origin: (origin, callback) => {
          if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            callback(new Error(`CORS not allowed: ${origin}`));
          }
        },

        credentials: true,
      }),
    );

    this.app.use(express.json());

    this.app.use(
      express.urlencoded({
        extended: true,
      }),
    );
  }

  private initializeRoutes(): void {
    const v1Router = Router();

    v1Router.get("/health", (_req: Request, res: Response) => {
      return res.status(200).json(success(null, "Server is running"));
    });

    const userRoutes = Container.get(UserRoutes);
    const questionRoutes = Container.get(QuestionRoutes);
    const quizRoutes = Container.get(QuizRoutes);

    v1Router.use("/users", userRoutes.router);
    v1Router.use("/questions", questionRoutes.router);
    v1Router.use("/quizzes", quizRoutes.router);

    this.app.use("/api/v1", v1Router);
  }

  private initializeErrorHandling(): void {
    this.app.use(notFoundHandler);

    this.app.use(errorHandler);
  }

  private async connectDatabase(): Promise<void> {
    try {
      await AppDataSource.initialize();

      console.log("MySQL connected successfully");
    } catch (error) {
      console.error("Database connection failed", error);

      process.exit(1);
    }
  }

  public async start(): Promise<void> {
    try {
      await this.connectDatabase();

      this.app.listen(this.port, () => {
        console.log(`Server running at http://localhost:${this.port}`);
      });
    } catch (error) {
      console.error("Application startup failed", error);
    }
  }
}

const application = new Application();

application.start();

export default application.app;
