import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from 'src/common/dtos/base-response.dto';

export class AuthenticatedUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @Expose()
  id: string;

  @ApiProperty({ example: 'John Doe' })
  @Expose()
  name: string;

  @ApiProperty({ example: 'user@example.com' })
  @Expose()
  email: string;

  @ApiProperty({ example: 'accessToken' })
  @Expose()
  accessToken: string;

  @ApiProperty({
    example: ['EMPLOYEE'],
    type: [String],
    description: 'User roles',
  })
  @Expose()
  roles: string[];

  constructor(partial: Partial<AuthenticatedUserDto>) {
    Object.assign(this, partial);
  }
}

export class LoginResponse extends BaseResponseDto {
  @ApiProperty({ type: AuthenticatedUserDto })
  data: AuthenticatedUserDto;
}

export class CurrentUserResponse extends BaseResponseDto {
  @ApiProperty({ type: AuthenticatedUserDto })
  data: AuthenticatedUserDto;
}
