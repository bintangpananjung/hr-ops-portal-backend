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
import { CheckInDto } from './dto/check-in.dto';
import { CheckOutDto } from './dto/check-out.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { RoleName } from 'src/common/enums/role.enum';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { JwtUser } from 'src/auth/types/jwt-user.type';
import { BaseResponseDto } from 'src/common/dtos/base-response.dto';
import { RolesGuard } from 'src/auth/guards/role.guard';

@Controller('attendances')
@UseGuards(JwtGuard)
export class AttendancesController {
  constructor(private readonly attendancesService: AttendancesService) {}

  @Post('check-in')
  @UseGuards(JwtGuard)
  async checkIn(@Body() checkInDto: CheckInDto, @CurrentUser() user: JwtUser) {
    const attendance = await this.attendancesService.checkIn(
      user.sub,
      checkInDto,
    );
    return BaseResponseDto.success(attendance, 'Check-in successful');
  }

  @Post('check-out')
  @UseGuards(JwtGuard)
  async checkOut(
    @Body() checkOutDto: CheckOutDto,
    @CurrentUser() user: JwtUser,
  ) {
    const attendance = await this.attendancesService.checkOut(
      user.sub,
      checkOutDto,
    );
    return BaseResponseDto.success(attendance, 'Check-out successful');
  }

  @Get('current')
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
    return BaseResponseDto.success(
      attendances,
      'Attendances retrieved successfully',
    );
  }

  @Get('current/today')
  @UseGuards(JwtGuard)
  async getCurrentEmployeeTodayAttendance(@CurrentUser() user: JwtUser) {
    const attendance = await this.attendancesService.findTodayAttendance(
      user.sub,
    );
    return BaseResponseDto.success(
      attendance,
      'Today attendance retrieved successfully',
    );
  }

  @Get('employee/:employeeId')
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
    return BaseResponseDto.success(
      attendances,
      'Employee attendances retrieved successfully',
    );
  }

  @Get('all')
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
    return BaseResponseDto.success(
      attendances,
      'All attendances retrieved successfully',
    );
  }

  @Patch(':id')
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
    return BaseResponseDto.success(
      attendance,
      'Attendance updated successfully',
    );
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(RoleName.SUPERADMIN, RoleName.ADMIN, RoleName.HR)
  async remove(@Param('id') id: string) {
    await this.attendancesService.remove(id);
    return BaseResponseDto.success(null, 'Attendance deleted successfully');
  }
}
