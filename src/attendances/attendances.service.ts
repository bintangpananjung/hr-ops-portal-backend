import { Injectable } from '@nestjs/common';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from 'src/generated/prisma';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

@Injectable()
export class AttendancesService {
  constructor(private readonly prisma: PrismaService) {}

  async attend(employeeId: string, createAttendanceDto: CreateAttendanceDto) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingAttendance = await this.prisma.attendance.findUnique({
      where: {
        employeeId_date: {
          employeeId,
          date: today,
        },
      },
    });

    if (existingAttendance) {
      // Update existing CHECK_IN to CHECK_OUT
      return this.prisma.attendance.update({
        where: {
          employeeId_date: {
            employeeId,
            date: today,
          },
        },
        data: createAttendanceDto,
        include: {
          employee: {
            select: {
              id: true,
              employeeId: true,
              name: true,
              email: true,
            },
          },
        },
      });
    }

    // Create new CHECK_IN record
    return this.prisma.attendance.create({
      data: {
        employeeId,
        date: today,
        workMode: createAttendanceDto.workMode,
        photoUrl: createAttendanceDto.photoUrl,
        checkIn: createAttendanceDto.checkIn,
        checkOut: createAttendanceDto.checkOut,
      },
      include: {
        employee: {
          select: {
            id: true,
            employeeId: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }
  async findByEmployeeId(
    employeeId: string,
    startDate?: string,
    endDate?: string,
  ) {
    const where: Prisma.AttendanceWhereInput = { employeeId };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    return this.prisma.attendance.findMany({
      where,
      include: {
        employee: {
          select: {
            id: true,
            employeeId: true,
            name: true,
            email: true,
            department: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  async findTodayAttendance(employeeId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.prisma.attendance.findUnique({
      where: {
        employeeId_date: {
          employeeId,
          date: today,
        },
      },
      include: {
        employee: {
          select: {
            id: true,
            employeeId: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findAll(startDate?: string, endDate?: string, employeeId?: string) {
    const where: Prisma.AttendanceWhereInput = {};

    if (employeeId) {
      where.employeeId = employeeId;
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    return this.prisma.attendance.findMany({
      where,
      include: {
        employee: {
          select: {
            id: true,
            employeeId: true,
            name: true,
            email: true,
            department: true,
            position: true,
          },
        },
      },
      orderBy: [{ date: 'desc' }, { employee: { name: 'asc' } }],
    });
  }

  async update(id: string, updateAttendanceDto: UpdateAttendanceDto) {
    return this.prisma.attendance.update({
      where: { id },
      data: {
        workMode: updateAttendanceDto.workMode,
        photoUrl: updateAttendanceDto.photoUrl,
        checkIn: updateAttendanceDto.checkIn,
        checkOut: updateAttendanceDto.checkOut,
      },
      include: {
        employee: {
          select: {
            id: true,
            employeeId: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    return this.prisma.attendance.delete({ where: { id } });
  }
}
