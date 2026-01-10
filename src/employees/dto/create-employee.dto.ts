import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
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
  @IsOptional()
  @ApiProperty({ example: '2024-01-10T00:00:00.000Z' })
  joinDate?: Date;

  @IsEnum(EmployeeStatus)
  @ApiProperty({ example: 'ACTIVE' })
  status?: EmployeeStatus;
}
