import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ChangePasswordDto,
  CreateUserRequestDto,
  UpdateUserRequestDto,
} from './dtos/user.request.dto';
import * as bcrypt from 'bcrypt';
import { AuthGuard } from '../auth/auth.guard';
import { Public } from '../common/decorators/public.decorator';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  private readonly saltRounds = 10;

  constructor(private readonly userService: UsersService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @Public()
  async create(@Body() user: CreateUserRequestDto) {
    const isDuplicate = await this.userService.findOne({
      where: { username: user.username },
    });

    if (isDuplicate) {
      throw new BadRequestException('username_existed');
    }

    const hashedPassword = await bcrypt.hash(user.password, this.saltRounds);
    const insertObj = await this.userService.create({
      ...user,
      password: hashedPassword,
    });

    return insertObj;
  }

  @Get('getUserInfo')
  async getUserInfo(@Req() req) {
    const { id } = req['user'];
    const user = await this.userService.findOne({ where: { id } });
    return user;
  }

  @Put('updateProfile')
  async update(@Req() req, @Body() updateUserDto: UpdateUserRequestDto) {
    const { id } = req['user'];
    const result = await this.userService.update(+id, updateUserDto);

    return result;
  }

  @Put('changePassword')
  async changePassword(
    @Req() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const { id } = req['user'];
    const password = (await this.userService.findOne({ where: { id } }))
      .password;

    const isMatch = await bcrypt.compare(
      changePasswordDto.oldPassword,
      password,
    );

    if (!isMatch) {
      throw new BadRequestException('incorrect current password');
    } else {
      const { newPassword, confirmPassword } = changePasswordDto;
      if (newPassword === confirmPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, this.saltRounds);
        const result = await this.userService.update(+id, {
          password: hashedPassword,
        });
        return result;
      } else {
        throw new BadRequestException('mismatch');
      }
    }
  }
}
