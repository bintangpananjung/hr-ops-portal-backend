import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';
import { BaseResponseDto } from 'src/common/dtos/base-response.dto';

export class AttendanceDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'uuid' })
  employeeId: string;

  @ApiProperty({ example: '2024-01-10T00:00:00.000Z' })
  date: Date;

  @ApiProperty({ example: '2024-01-10T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  checkIn?: Date;

  @ApiProperty({ example: '2024-01-10T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  checkOut?: Date;

  @ApiProperty({ example: 'WFH', enum: ['WFH', 'WFO'] })
  workMode: string;

  @ApiProperty({ example: 'http://localhost:8000/uploads/photo.jpg' })
  photoUrl: string;

  @ApiProperty({ example: '2024-01-10T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-10T00:00:00.000Z' })
  updatedAt: Date;
}

export class AttendanceResponse extends BaseResponseDto {
  @ApiProperty({ type: () => AttendanceDto })
  data: AttendanceDto;
}

export class AttendanceListResponse extends BaseResponseDto {
  @ApiProperty({ type: () => [AttendanceDto] })
  data: AttendanceDto[];
}
