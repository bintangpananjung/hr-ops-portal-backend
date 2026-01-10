import { Test, TestingModule } from '@nestjs/testing';
import { AttendancesService } from './attendances.service';
import { PrismaService } from 'src/prisma.service';
import { BadRequestException } from '@nestjs/common';
import { WorkMode } from 'src/generated/prisma';

describe('AttendancesService', () => {
  let service: AttendancesService;

  const mockPrismaService = {
    attendance: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttendancesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AttendancesService>(AttendancesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkIn', () => {
    const employeeId = 'employee-123';
    const checkInDto = {
      employeeId,
      date: new Date().toISOString(),
      checkIn: new Date().toISOString(),
      workMode: WorkMode.WFO,
      photoUrl: '/uploads/photo.jpg',
    };

    it('should successfully check in', async () => {
      const mockAttendance = {
        id: 'attendance-123',
        employeeId,
        date: new Date(),
        checkIn: new Date(checkInDto.checkIn),
        workMode: checkInDto.workMode,
        photoUrl: checkInDto.photoUrl,
        employee: {
          id: employeeId,
          employeeId: 'EMP001',
          name: 'John Doe',
          email: 'john@example.com',
        },
      };

      mockPrismaService.attendance.findUnique.mockResolvedValue(null);
      mockPrismaService.attendance.create.mockResolvedValue(mockAttendance);

      const result = await service.checkIn(employeeId, checkInDto);

      expect(result).toEqual(mockAttendance);
      expect(mockPrismaService.attendance.findUnique).toHaveBeenCalled();
      expect(mockPrismaService.attendance.create).toHaveBeenCalled();
    });

    it('should throw error if already checked in today', async () => {
      mockPrismaService.attendance.findUnique.mockResolvedValue({
        id: 'existing-attendance',
        employeeId,
      });

      await expect(service.checkIn(employeeId, checkInDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.checkIn(employeeId, checkInDto)).rejects.toThrow(
        'Already checked in today',
      );
    });
  });

  describe('checkOut', () => {
    const employeeId = 'employee-123';
    const checkOutDto = {
      employeeId,
      date: new Date().toISOString(),
      checkOut: new Date().toISOString(),
      photoUrl: '/uploads/photo-out.jpg',
    };

    it('should successfully check out', async () => {
      const mockAttendance = {
        id: 'attendance-123',
        employeeId,
        checkOut: null,
      };

      const mockUpdatedAttendance = {
        ...mockAttendance,
        checkOut: new Date(checkOutDto.checkOut),
        photoUrl: checkOutDto.photoUrl,
        employee: {
          id: employeeId,
          employeeId: 'EMP001',
          name: 'John Doe',
          email: 'john@example.com',
        },
      };

      mockPrismaService.attendance.findUnique.mockResolvedValue(mockAttendance);
      mockPrismaService.attendance.update.mockResolvedValue(
        mockUpdatedAttendance,
      );

      const result = await service.checkOut(employeeId, checkOutDto);

      expect(result).toEqual(mockUpdatedAttendance);
      expect(mockPrismaService.attendance.update).toHaveBeenCalled();
    });

    it('should throw error if no check-in record found', async () => {
      mockPrismaService.attendance.findUnique.mockResolvedValue(null);

      await expect(service.checkOut(employeeId, checkOutDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.checkOut(employeeId, checkOutDto)).rejects.toThrow(
        'No check-in record found for today',
      );
    });

    it('should throw error if already checked out', async () => {
      mockPrismaService.attendance.findUnique.mockResolvedValue({
        id: 'attendance-123',
        employeeId,
        checkOut: new Date(),
      });

      await expect(service.checkOut(employeeId, checkOutDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.checkOut(employeeId, checkOutDto)).rejects.toThrow(
        'Already checked out today',
      );
    });
  });

  describe('findByEmployeeId', () => {
    const employeeId = 'employee-123';

    it('should return attendances for employee', async () => {
      const mockAttendances = [
        {
          id: 'attendance-1',
          employeeId,
          date: new Date(),
          employee: {
            id: employeeId,
            employeeId: 'EMP001',
            name: 'John Doe',
            email: 'john@example.com',
            department: 'Engineering',
          },
        },
      ];

      mockPrismaService.attendance.findMany.mockResolvedValue(mockAttendances);

      const result = await service.findByEmployeeId(employeeId);

      expect(result).toEqual(mockAttendances);
      expect(mockPrismaService.attendance.findMany).toHaveBeenCalled();
    });

    it('should filter by date range', async () => {
      const startDate = '2024-01-01';
      const endDate = '2024-01-31';

      mockPrismaService.attendance.findMany.mockResolvedValue([]);

      await service.findByEmployeeId(employeeId, startDate, endDate);

      expect(mockPrismaService.attendance.findMany).toHaveBeenCalled();
    });
  });

  describe('findTodayAttendance', () => {
    const employeeId = 'employee-123';

    it('should return today attendance', async () => {
      const mockAttendance = {
        id: 'attendance-123',
        employeeId,
        date: new Date(),
        employee: {
          id: employeeId,
          employeeId: 'EMP001',
          name: 'John Doe',
          email: 'john@example.com',
        },
      };

      mockPrismaService.attendance.findUnique.mockResolvedValue(mockAttendance);

      const result = await service.findTodayAttendance(employeeId);

      expect(result).toEqual(mockAttendance);
      expect(mockPrismaService.attendance.findUnique).toHaveBeenCalled();
    });

    it('should return null if no attendance today', async () => {
      mockPrismaService.attendance.findUnique.mockResolvedValue(null);

      const result = await service.findTodayAttendance(employeeId);

      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all attendances', async () => {
      const mockAttendances = [
        {
          id: 'attendance-1',
          employeeId: 'emp-1',
          date: new Date(),
          employee: {
            id: 'emp-1',
            employeeId: 'EMP001',
            name: 'John Doe',
            email: 'john@example.com',
            department: 'Engineering',
            position: 'Developer',
          },
        },
      ];

      mockPrismaService.attendance.findMany.mockResolvedValue(mockAttendances);

      const result = await service.findAll();

      expect(result).toEqual(mockAttendances);
      expect(mockPrismaService.attendance.findMany).toHaveBeenCalled();
    });

    it('should filter by employeeId', async () => {
      const employeeId = 'employee-123';

      mockPrismaService.attendance.findMany.mockResolvedValue([]);

      await service.findAll(undefined, undefined, employeeId);

      expect(mockPrismaService.attendance.findMany).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    const id = 'attendance-123';
    const updateDto = {
      employeeId: 'employee-123',
      date: new Date().toISOString(),
      checkIn: new Date().toISOString(),
      checkOut: new Date().toISOString(),
      workMode: WorkMode.WFH,
    };

    it('should update attendance', async () => {
      const mockUpdatedAttendance = {
        id,
        ...updateDto,
        employee: {
          id: 'emp-1',
          employeeId: 'EMP001',
          name: 'John Doe',
          email: 'john@example.com',
        },
      };

      mockPrismaService.attendance.update.mockResolvedValue(
        mockUpdatedAttendance,
      );

      const result = await service.update(id, updateDto);

      expect(result).toEqual(mockUpdatedAttendance);
      expect(mockPrismaService.attendance.update).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    const id = 'attendance-123';

    it('should delete attendance', async () => {
      const mockDeletedAttendance = { id };

      mockPrismaService.attendance.delete.mockResolvedValue(
        mockDeletedAttendance,
      );

      const result = await service.remove(id);

      expect(result).toEqual(mockDeletedAttendance);
      expect(mockPrismaService.attendance.delete).toHaveBeenCalledWith({
        where: { id },
      });
    });
  });
});
