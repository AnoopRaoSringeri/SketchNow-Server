import { NextFunction, Request, Response } from "express";

export function tryCatch<P = {}, ResBody = {}, ReqBody = {}, ReqQuery = {}>(
  controller: (
    req: Request<P, ResBody, ReqBody, ReqQuery>,
    res: Response,
  ) => unknown,
) {
  return async (
    req: Request<P, ResBody, ReqBody, ReqQuery>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      return await controller(req, res);
    } catch (error) {
      return next(error);
    }
  };
}
