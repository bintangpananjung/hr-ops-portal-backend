import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AttendancesService } from './attendances.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { RoleName } from 'src/common/enums/role.enum';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { JwtUser } from 'src/auth/types/jwt-user.type';
import { ResponseMapper } from 'src/common/mappers/response.mapper';
import { RolesGuard } from 'src/auth/guards/role.guard';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import {
  AttendanceListResponse,
  AttendanceResponse,
} from './dto/attendance.dto';
import { BaseResponseDto } from 'src/common/dtos/base-response.dto';

@ApiTags('Attendances')
@Controller('attendances')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class AttendancesController {
  constructor(private readonly attendancesService: AttendancesService) {}

  @Post('')
  @ApiOperation({ summary: 'Attend (check-in/check-out)' })
  @ApiResponse({
    status: 200,
    description: 'Attend successful',
    type: AttendanceResponse,
  })
  @ApiResponse({ status: 400, description: 'Already checked in for today' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtGuard)
  async attendance(
    @Body() attendanceDto: CreateAttendanceDto,
    @CurrentUser() user: JwtUser,
  ) {
    const attendance = await this.attendancesService.attend(
      user.sub,
      attendanceDto,
    );
    return ResponseMapper.toSuccessResponse(attendance, 'Attend successful');
  }

  @Get('current')
  @ApiOperation({ summary: 'Get current employee attendances' })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Start date (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'End date (YYYY-MM-DD)',
  })
  @ApiResponse({
    status: 200,
    description: 'Attendances retrieved successfully',
    type: AttendanceListResponse,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtGuard)
  async getCurrentEmployeeAttendances(
    @CurrentUser() user: JwtUser,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const attendances = await this.attendancesService.findByEmployeeId(
      user.sub,
      startDate,
      endDate,
    );
    return ResponseMapper.toSuccessResponse(
      attendances,
      'Attendances retrieved successfully',
    );
  }

  @Get('current/today')
  @ApiOperation({ summary: 'Get current employee today attendance' })
  @ApiResponse({
    status: 200,
    description: 'Today attendance retrieved successfully',
    type: AttendanceResponse,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtGuard)
  async getCurrentEmployeeTodayAttendance(@CurrentUser() user: JwtUser) {
    const attendance = await this.attendancesService.findTodayAttendance(
      user.sub,
    );
    return ResponseMapper.toSuccessResponse(
      attendance,
      'Today attendance retrieved successfully',
    );
  }

  @Get('employee/:employeeId')
  @ApiOperation({ summary: 'Get employee attendances (Admin only)' })
  @ApiParam({ name: 'employeeId', description: 'Employee ID' })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Start date (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'End date (YYYY-MM-DD)',
  })
  @ApiResponse({
    status: 200,
    description: 'Employee attendances retrieved successfully',
    type: AttendanceListResponse,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @UseGuards(RolesGuard)
  @Roles(RoleName.SUPERADMIN, RoleName.ADMIN, RoleName.HR)
  async getEmployeeAttendances(
    @Param('employeeId') employeeId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const attendances = await this.attendancesService.findByEmployeeId(
      employeeId,
      startDate,
      endDate,
    );
    return ResponseMapper.toSuccessResponse(
      attendances,
      'Employee attendances retrieved successfully',
    );
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all attendances (Admin only)' })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Start date (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'End date (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'employeeId',
    required: false,
    description: 'Filter by employee ID',
  })
  @ApiResponse({
    status: 200,
    description: 'All attendances retrieved successfully',
    type: AttendanceListResponse,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @UseGuards(RolesGuard)
  @Roles(RoleName.SUPERADMIN, RoleName.ADMIN, RoleName.HR)
  async getAllAttendances(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('employeeId') employeeId?: string,
  ) {
    const attendances = await this.attendancesService.findAll(
      startDate,
      endDate,
      employeeId,
    );
    return ResponseMapper.toSuccessResponse(
      attendances,
      'All attendances retrieved successfully',
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update attendance (Admin only)' })
  @ApiParam({ name: 'id', description: 'Attendance ID' })
  @ApiResponse({
    status: 200,
    description: 'Attendance updated successfully',
    type: AttendanceResponse,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'Attendance not found' })
  @UseGuards(RolesGuard)
  @Roles(RoleName.SUPERADMIN, RoleName.ADMIN, RoleName.HR)
  async update(
    @Param('id') id: string,
    @Body() updateAttendanceDto: UpdateAttendanceDto,
  ) {
    const attendance = await this.attendancesService.update(
      id,
      updateAttendanceDto,
    );
    return ResponseMapper.toSuccessResponse(
      attendance,
      'Attendance updated successfully',
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete attendance (Admin only)' })
  @ApiParam({ name: 'id', description: 'Attendance ID' })
  @ApiResponse({
    status: 200,
    description: 'Attendance deleted successfully',
    type: BaseResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'Attendance not found' })
  @UseGuards(RolesGuard)
  @Roles(RoleName.SUPERADMIN, RoleName.ADMIN, RoleName.HR)
  async remove(@Param('id') id: string) {
    await this.attendancesService.remove(id);
    return ResponseMapper.toSuccessResponse(
      null,
      'Attendance deleted successfully',
    );
  }
}
