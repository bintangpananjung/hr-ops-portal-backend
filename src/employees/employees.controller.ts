import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import {
  EmployeeDtoListResponse,
  EmployeeDtoResponse,
} from './dto/employee.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { RoleName } from 'src/common/enums/role.enum';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BaseResponseDto } from 'src/common/dtos/base-response.dto';
import { ResponseMapper } from 'src/common/mappers/response.mapper';

@ApiTags('Employees')
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @ApiOperation({ summary: 'Create new employee' })
  @ApiResponse({
    status: 200,
    description: 'Employee created successfully',
    type: EmployeeDtoResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(RoleName.SUPERADMIN, RoleName.ADMIN, RoleName.HR)
  async create(@Body() createEmployeeDto: CreateEmployeeDto) {
    const employee = await this.employeesService.create(createEmployeeDto);
    return ResponseMapper.toSuccessResponse(
      employee,
      'Employee created successfully',
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all employees' })
  @ApiResponse({
    status: 200,
    description: 'Employees retrieved successfully',
    type: EmployeeDtoListResponse,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(RoleName.SUPERADMIN, RoleName.ADMIN, RoleName.HR)
  async findAll() {
    const employees = await this.employeesService.findAll();
    return ResponseMapper.toSuccessResponse(
      employees,
      'Employees retrieved successfully',
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get employee by ID' })
  @ApiResponse({
    status: 200,
    description: 'Employee retrieved successfully',
    type: EmployeeDtoResponse,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(RoleName.SUPERADMIN, RoleName.ADMIN, RoleName.HR)
  async findOne(@Param('id') id: string) {
    const employee = await this.employeesService.findOne(id);
    return ResponseMapper.toSuccessResponse(
      employee,
      'Employee retrieved successfully',
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update employee by ID' })
  @ApiResponse({
    status: 200,
    description: 'Employee updated successfully',
    type: EmployeeDtoResponse,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(RoleName.SUPERADMIN, RoleName.ADMIN, RoleName.HR)
  async update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    const employee = await this.employeesService.update(id, updateEmployeeDto);
    return ResponseMapper.toSuccessResponse(
      employee,
      'Employee updated successfully',
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete employee by ID' })
  @ApiResponse({
    status: 200,
    description: 'Employee deleted successfully',
    type: BaseResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(RoleName.SUPERADMIN, RoleName.ADMIN, RoleName.HR)
  async remove(@Param('id') id: string) {
    await this.employeesService.remove(id);
    return ResponseMapper.toSuccessResponse(
      null,
      'Employee deleted successfully',
    );
  }
}
