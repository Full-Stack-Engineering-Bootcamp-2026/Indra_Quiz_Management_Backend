import { Router } from "express";

import { Service } from "typedi";
import { loginValidationSchema } from "../validator/login.validation";
import { registerValidationSchema } from "../validator/register.validation";
import { UserController } from "../controller/user.controller";
import { validate } from "../../../common/middleware/validate.middleware";

@Service()
export class UserRoutes {
  public router: Router;

  constructor(private readonly userController: UserController) {
    this.router = Router();

    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      "/login",
      validate(loginValidationSchema),
      this.userController.login,
    );
    this.router.post(
      "/register/user",
      validate(registerValidationSchema),
      this.userController.registerUser,
    );
    this.router.post(
      "/register/admin",
      validate(registerValidationSchema),
      this.userController.registerAdmin,
    );
  }
}
