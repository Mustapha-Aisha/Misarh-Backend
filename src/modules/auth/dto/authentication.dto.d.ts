export declare class CreateUserDto {
    name: string;
    email: string;
    username: string;
    password: string;
}
export declare class VerifyCodeDto {
    email: string;
    code: string;
    type: 'REGISTER' | 'RESET_PASSWORD';
}
export declare class ResetAccountDto {
    generic_data: string;
}
export declare class ChangePasswordDto {
    email: string;
    password: string;
    confirm_password: string;
}
export declare class CreateLoginDto {
    email: string;
    password: string;
}
