import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationException extends HttpException {
  messages; // new property

  constructor(response) {
    super(response, HttpStatus.BAD_REQUEST);
    this.messages = response;
  }
}