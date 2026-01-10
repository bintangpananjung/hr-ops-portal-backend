import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from 'src/common/dtos/base-response.dto';

export class EmployeeDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'EMP001' })
  employeeId: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 'john@example.com' })
  email: string;

  @ApiProperty({ example: '+1234567890', required: false })
  phone?: string;

  @ApiProperty({ example: 'Engineering', required: false })
  department?: string;

  @ApiProperty({ example: 'Software Engineer', required: false })
  position?: string;

  @ApiProperty({ example: '2024-01-10T00:00:00.000Z', required: false })
  joinDate?: Date;

  @ApiProperty({ example: 'ACTIVE', enum: ['ACTIVE', 'INACTIVE', 'ON_LEAVE'] })
  status: string;

  @ApiProperty({ example: '2024-01-10T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-10T00:00:00.000Z' })
  updatedAt: Date;
}

export class EmployeeDtoResponse extends BaseResponseDto {
  @ApiProperty({ type: () => EmployeeDto })
  data: EmployeeDto;
}

export class EmployeeDtoListResponse extends BaseResponseDto {
  @ApiProperty({ type: () => [EmployeeDto] })
  data: EmployeeDto[];
}
