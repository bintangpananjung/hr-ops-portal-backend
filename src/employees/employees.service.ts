import { Injectable, ConflictException } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PrismaService } from 'src/prisma.service';
import { Employee } from 'src/generated/prisma';
import * as bcrypt from 'bcrypt';
import { SALT_ROUNDS } from 'src/auth/constant/auth.constant';

@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const existingEmail = await this.prisma.employee.findUnique({
      where: { email: createEmployeeDto.email },
    });

    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    const existingEmployeeId = await this.prisma.employee.findUnique({
      where: { employeeId: createEmployeeDto.employeeId },
    });

    if (existingEmployeeId) {
      throw new ConflictException('Employee ID already exists');
    }

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

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    if (updateEmployeeDto.email) {
      const existingEmail = await this.prisma.employee.findUnique({
        where: { email: updateEmployeeDto.email },
      });

      if (existingEmail && existingEmail.id !== id) {
        throw new ConflictException('Email already exists');
      }
    }

    if (updateEmployeeDto.employeeId) {
      const existingEmployeeId = await this.prisma.employee.findUnique({
        where: { employeeId: updateEmployeeDto.employeeId },
      });

      if (existingEmployeeId && existingEmployeeId.id !== id) {
        throw new ConflictException('Employee ID already exists');
      }
    }

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
