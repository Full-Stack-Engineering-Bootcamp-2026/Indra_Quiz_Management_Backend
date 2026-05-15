import { Request, Response } from "express";

import { Service } from "typedi";

import { UserService } from "../service/user.service";

import { success } from "../../../Http_Response/response";
import { HttpStatus } from "../../../common/constants/http-status.constants";

@Service()
export class UserController {
  constructor(private readonly userService: UserService) {}

  public login = async (req: Request, res: Response): Promise<void> => {
    const result = await this.userService.login(req.body);

    res.status(HttpStatus.OK).json(success(result, "Login successful"));
  };

  public registerUser = async (req: Request, res: Response): Promise<void> => {
    const result = await this.userService.registerUser(req.body);

    res
      .status(HttpStatus.CREATED)
      .json(success(result, "User registered successfully"));
  };

  public registerAdmin = async (req: Request, res: Response): Promise<void> => {
    const result = await this.userService.registerAdmin(req.body);

    res
      .status(HttpStatus.CREATED)
      .json(success(result, "Admin registered successfully"));
  };
}
