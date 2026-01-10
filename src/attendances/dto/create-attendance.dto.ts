import { IsString, IsDateString, IsOptional, IsEnum } from 'class-validator';
import { AttendanceType, WorkMode } from 'src/generated/prisma';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAttendanceDto {
  @IsString()
  @ApiProperty({ example: 'user@example.com' })
  employeeId: string;

  @IsDateString()
  @ApiProperty({ example: '2022-01-01' })
  date: string;

  @IsEnum(AttendanceType)
  @ApiProperty({ example: AttendanceType.CHECK_IN })
  type: AttendanceType;

  @IsOptional()
  @IsEnum(WorkMode)
  workMode?: WorkMode;

  @IsString()
  @ApiProperty({ example: 'https://example.com/photo.jpg' })
  photoUrl: string;
}
