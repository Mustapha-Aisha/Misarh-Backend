import { HttpStatus } from '@nestjs/common';
export declare class BaseResponse<T> {
    message?: string;
    data?: T;
    success: boolean;
    status_code: HttpStatus;
    private constructor();
    static success<T>(data?: T, message?: string, status_code?: HttpStatus): BaseResponse<T>;
    static error<T>(message: string, data?: T, status_code?: HttpStatus): BaseResponse<T>;
}
