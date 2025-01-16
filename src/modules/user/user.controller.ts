import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CurrentUser } from './decorator/user.decorator';
import { UpdateUserDto } from './dto/user.dto';
import { CreateUserDto } from '../auth/dto/authentication.dto';
import { BaseResponse } from 'src/libs/response/base_response';
import { Public } from '../auth/strategy/public-strategy';


@Controller('user/')
export class UserController {
  constructor(private readonly userService: UserService) { }
  
  @Public()
  @Post('register-account')
  async registerAccount(
    @Body() createUserDto: CreateUserDto,
  ): Promise<BaseResponse<any>> {
    return this.userService.createUser(createUserDto);
  }

  @Get('me')
  getMe(@CurrentUser() user: any) {
    return this.userService.getMe(user.id);
  }

  @Post('update')
  updateUser(@CurrentUser() user: any, @Body() data: UpdateUserDto) {
    return this.userService.updateUser(user.id, data);
  }

  @Delete('delete')
  deleteUser(@CurrentUser() user: any) {
    return this.userService.deleteUser(user.id);
  }

  @Get('get-user-by-id/:id')
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

}
