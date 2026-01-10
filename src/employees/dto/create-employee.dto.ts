import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsString, IsUUID } from 'class-validator';
import { EmployeeStatus } from 'src/generated/prisma';

export class CreateEmployeeDto {
  @IsUUID()
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  employeeId: string;

  @IsString()
  @ApiProperty({ example: 'John Doe' })
  name: string;

  @IsString()
  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @IsString()
  @ApiProperty({ example: 'password' })
  password: string;

  @IsString()
  @ApiProperty({ example: '08123456789' })
  phone?: string;

  @IsString()
  @ApiProperty({ example: 'IT' })
  department?: string;

  @IsString()
  @ApiProperty({ example: 'Software Engineer' })
  position?: string;

  @IsDateString()
  @ApiProperty({ example: '2022-01-01' })
  joinDate?: string;

  @IsEnum(EmployeeStatus)
  @ApiProperty({ example: 'ACTIVE' })
  status?: EmployeeStatus;
}
