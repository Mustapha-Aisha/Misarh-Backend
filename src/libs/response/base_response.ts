import { HttpException, HttpStatus } from '@nestjs/common';

export class BaseResponse<T> {
  message?: string;
  data?: T; // Make data optional
  status: boolean;
  status_code: HttpStatus;

  private constructor(
    status: boolean,
    status_code?: HttpStatus,
    message?: string,
    data?: T,
  ) {
    this.status = status;
    this.status_code =
      status_code || (status ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    this.message = message;

    // Conditionally add data to the response
    if (data !== null && data !== undefined) {
      this.data = data;
    }
  }

  static success<T>(
    data?: T,
    message?: string,
    status_code?: HttpStatus,
  ): BaseResponse<T> {
    return new BaseResponse(true, status_code, message, data);
  }

  static error<T>(
    message: string,
    data?: T,
    status_code?: HttpStatus,
  ): BaseResponse<T> {
    throw new HttpException({ status_code, message }, status_code);
  }
}
