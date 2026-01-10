import { ApiProperty } from '@nestjs/swagger';

export class AttendanceDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'uuid' })
  employeeId: string;

  @ApiProperty({ example: '2024-01-10T00:00:00.000Z' })
  date: Date;

  @ApiProperty({ example: 'CHECK_IN', enum: ['CHECK_IN', 'CHECK_OUT'] })
  type: string;

  @ApiProperty({ example: 'WFH', enum: ['WFH', 'WFO'] })
  workMode: string;

  @ApiProperty({ example: 'http://localhost:8000/uploads/photo.jpg' })
  photoUrl: string;

  @ApiProperty({ example: '2024-01-10T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-10T00:00:00.000Z' })
  updatedAt: Date;
}
