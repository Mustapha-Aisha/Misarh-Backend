import { UserService } from './user.service';
import { UpdateUserDto } from './dto/user.dto';
import { CreateUserDto } from '../auth/dto/authentication.dto';
import { BaseResponse } from 'src/libs/response/base_response';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    registerAccount(createUserDto: CreateUserDto): Promise<BaseResponse<any>>;
    getMe(user: any): Promise<BaseResponse<import("./entity/user.entity").UserEntity>>;
    updateUser(user: any, data: UpdateUserDto): Promise<BaseResponse<import("typeorm").UpdateResult>>;
    deleteUser(user: any): Promise<BaseResponse<any>>;
    getUserById(id: string): Promise<BaseResponse<import("./entity/user.entity").UserEntity>>;
}
