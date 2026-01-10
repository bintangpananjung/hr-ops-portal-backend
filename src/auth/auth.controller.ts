import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { BaseResponseDto } from 'src/common/dtos/base-response.dto';
import { AuthenticatedUserDto } from './dtos/authenticated-user.dto';
import { JwtGuard } from './guards/jwt.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import type { JwtUser } from './types/jwt-user.type';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() dto: LoginDto,
  ): Promise<BaseResponseDto<AuthenticatedUserDto>> {
    const authenticatedUser = await this.authService.login(dto);
    return BaseResponseDto.success(authenticatedUser, 'Login successful');
  }

  @Get('current')
  @UseGuards(JwtGuard)
  async getCurrentEmployee(@CurrentUser() user: JwtUser) {
    const currentUser = await this.authService.getCurrentEmployee(user.sub);
    return BaseResponseDto.success(
      currentUser,
      'Current user retrieved successfully',
    );
  }
}
