import { IsString, IsDateString, IsOptional, IsEnum } from 'class-validator';
import { WorkMode } from 'src/generated/prisma';

export class UpdateAttendanceDto {
  @IsString()
  employeeId: string;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsDateString()
  checkIn?: string;

  @IsOptional()
  @IsDateString()
  checkOut?: string;

  @IsOptional()
  @IsEnum(WorkMode)
  workMode?: WorkMode;

  @IsOptional()
  @IsString()
  photoUrl?: string;
}
