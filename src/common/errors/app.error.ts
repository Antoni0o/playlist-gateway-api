import { HttpStatus } from '@nestjs/common';

export class AppError extends Error {
  readonly statusCode: HttpStatus;

  constructor(message: string, statusCode: HttpStatus) {
    super(message);
    this.statusCode = statusCode;
  }
}
