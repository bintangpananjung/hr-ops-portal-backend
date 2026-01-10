import { Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PrismaService } from 'src/prisma.service';
import { Employee } from 'src/generated/prisma';

@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: PrismaService) {}
  create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
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
