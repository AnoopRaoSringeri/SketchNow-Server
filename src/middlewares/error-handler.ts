import { NextFunction, Request, Response } from "express";

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  return res.send(400).json({
    error: error.message,
  });
}
