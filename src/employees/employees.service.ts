import { Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PrismaService } from 'src/prisma.service';
import { Employee } from 'src/generated/prisma';
import * as bcrypt from 'bcrypt';
import { SALT_ROUNDS } from 'src/auth/constant/auth.constant';

@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: PrismaService) {}
  create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    createEmployeeDto.password = bcrypt.hashSync(
      createEmployeeDto.password,
      SALT_ROUNDS,
    );
    return this.prisma.employee.create({
      data: createEmployeeDto,
    });
  }

  findAll() {
    return this.prisma.employee.findMany();
  }

  findOne(id: string) {
    return this.prisma.employee.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    if (updateEmployeeDto.password) {
      updateEmployeeDto.password = bcrypt.hashSync(
        updateEmployeeDto.password,
        SALT_ROUNDS,
      );
    }
    return this.prisma.employee.update({
      where: {
        id,
      },
      data: updateEmployeeDto,
    });
  }

  remove(id: string) {
    return this.prisma.employee.delete({
      where: {
        id,
      },
    });
  }
}
