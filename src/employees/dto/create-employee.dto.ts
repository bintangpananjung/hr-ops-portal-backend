import { IsDateString, IsEnum, IsString, IsUUID } from 'class-validator';
import { EmployeeStatus } from 'src/generated/prisma';

export class CreateEmployeeDto {
  @IsUUID()
  employeeId: string;

  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsString()
  phone?: string;

  @IsString()
  department?: string;

  @IsString()
  position?: string;

  @IsDateString()
  joinDate?: string;

  @IsEnum(EmployeeStatus)
  status?: EmployeeStatus;
}
