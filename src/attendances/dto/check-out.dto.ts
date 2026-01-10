import { IsString, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { WorkMode } from 'src/generated/prisma';

export class CheckOutDto {
  @IsString()
  employeeId: string;

  @IsDateString()
  date: string;

  @IsDateString()
  checkOut: string;

  @IsOptional()
  @IsEnum(WorkMode)
  workMode?: WorkMode;

  @IsString()
  photoUrl: string;
}
