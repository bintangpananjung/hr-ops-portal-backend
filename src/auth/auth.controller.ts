import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { BaseResponseDto } from 'src/common/dtos/base-response.dto';
import { AuthenticatedUserDto } from './dtos/authenticated-user.dto';
import { JwtGuard } from './guards/jwt.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import type { JwtUser } from './types/jwt-user.type';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login to get access token' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: BaseResponseDto<AuthenticatedUserDto>,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Body() dto: LoginDto,
  ): Promise<BaseResponseDto<AuthenticatedUserDto>> {
    const authenticatedUser = await this.authService.login(dto);
    return BaseResponseDto.success(authenticatedUser, 'Login successful');
  }

  @Get('current')
  @ApiOperation({ summary: 'Get current authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'Current user retrieved successfully',
    type: AuthenticatedUserDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  async getCurrentEmployee(@CurrentUser() user: JwtUser) {
    const currentUser = await this.authService.getCurrentEmployee(user.sub);
    return BaseResponseDto.success(
      currentUser,
      'Current user retrieved successfully',
    );
  }
}
