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
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { RoleName } from 'src/common/enums/role.enum';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(RoleName.SUPERADMIN, RoleName.ADMIN, RoleName.HR)
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  @Get()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(RoleName.SUPERADMIN, RoleName.ADMIN, RoleName.HR)
  findAll() {
    return this.employeesService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(RoleName.SUPERADMIN, RoleName.ADMIN, RoleName.HR)
  findOne(@Param('id') id: string) {
    return this.employeesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(RoleName.SUPERADMIN, RoleName.ADMIN, RoleName.HR)
  update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeesService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(RoleName.SUPERADMIN, RoleName.ADMIN, RoleName.HR)
  remove(@Param('id') id: string) {
    return this.employeesService.remove(id);
  }
}
