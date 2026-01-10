import { IsString, IsDateString, IsOptional, IsEnum } from 'class-validator';
import { WorkMode } from 'src/generated/prisma';

export class CheckInDto {
  @IsString()
  employeeId: string;

  @IsDateString()
  date: string;

  @IsDateString()
  checkIn?: string;

  @IsOptional()
  @IsEnum(WorkMode)
  workMode?: WorkMode;

  @IsString()
  photoUrl: string;
}
