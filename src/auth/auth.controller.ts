import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { BaseResponseDto } from 'src/common/dtos/base-response.dto';
import { AuthenticatedUserDto } from './dtos/authenticated-user.dto';

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
}
