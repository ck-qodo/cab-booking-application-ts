import { Controller, Get, Put, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile/:userId')
  async getProfile(@Param('userId') userId: string) {
    return this.userService.getProfile(userId);
  }

  @Put('profile/:userId')
  async updateProfile(@Param('userId') userId: string, @Body() userData: any) {
    return this.userService.updateProfile(userId, userData);
  }

  @Get('ride-history/:userId')
  async getRideHistory(@Param('userId') userId: string) {
    return this.userService.getRideHistory(userId);
  }
} 