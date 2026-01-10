import { Test, TestingModule } from '@nestjs/testing';
import { AttendancesController } from './attendances.controller';
import { AttendancesService } from './attendances.service';
import { WorkMode } from 'src/generated/prisma';
import type { JwtUser } from 'src/auth/types/jwt-user.type';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';

describe('AttendancesController', () => {
  let controller: AttendancesController;
  let service: AttendancesService;

  const mockAttendancesService = {
    checkIn: jest.fn(),
    checkOut: jest.fn(),
    findByEmployeeId: jest.fn(),
    findTodayAttendance: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockUser: JwtUser = {
    sub: 'user-123',
    email: 'test@example.com',
    roles: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttendancesController],
      providers: [
        {
          provide: AttendancesService,
          useValue: mockAttendancesService,
        },
      ],
    })
      .overrideGuard(JwtGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AttendancesController>(AttendancesController);
    service = module.get<AttendancesService>(AttendancesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('checkIn', () => {
    it('should check in successfully', async () => {
      const checkInDto = {
        employeeId: mockUser.sub,
        date: new Date().toISOString(),
        checkIn: new Date().toISOString(),
        workMode: WorkMode.WFO,
        photoUrl: '/uploads/photo.jpg',
      };

      const mockAttendance = {
        id: 'attendance-123',
        employeeId: mockUser.sub,
        date: new Date(),
        checkIn: new Date(),
        workMode: WorkMode.WFO,
        photoUrl: '/uploads/photo.jpg',
      };

      mockAttendancesService.checkIn.mockResolvedValue(mockAttendance);

      const result = await controller.checkIn(checkInDto, mockUser);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Check-in successful');
      expect(result.data).toEqual(mockAttendance);
      expect(service.checkIn).toHaveBeenCalledWith(mockUser.sub, checkInDto);
    });
  });

  describe('checkOut', () => {
    it('should check out successfully', async () => {
      const checkOutDto = {
        employeeId: mockUser.sub,
        date: new Date().toISOString(),
        checkOut: new Date().toISOString(),
        photoUrl: '/uploads/photo-out.jpg',
      };

      const mockAttendance = {
        id: 'attendance-123',
        employeeId: mockUser.sub,
        checkOut: new Date(),
        photoUrl: '/uploads/photo-out.jpg',
      };

      mockAttendancesService.checkOut.mockResolvedValue(mockAttendance);

      const result = await controller.checkOut(checkOutDto, mockUser);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Check-out successful');
      expect(result.data).toEqual(mockAttendance);
      expect(service.checkOut).toHaveBeenCalledWith(mockUser.sub, checkOutDto);
    });
  });

  describe('getCurrentEmployeeAttendances', () => {
    it('should get current employee attendances', async () => {
      const mockAttendances = [
        {
          id: 'attendance-1',
          employeeId: mockUser.sub,
          date: new Date(),
        },
      ];

      mockAttendancesService.findByEmployeeId.mockResolvedValue(
        mockAttendances,
      );

      const result = await controller.getCurrentEmployeeAttendances(mockUser);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Attendances retrieved successfully');
      expect(result.data).toEqual(mockAttendances);
      expect(service.findByEmployeeId).toHaveBeenCalledWith(
        mockUser.sub,
        undefined,
        undefined,
      );
    });

    it('should get attendances with date range', async () => {
      const startDate = '2024-01-01';
      const endDate = '2024-01-31';

      mockAttendancesService.findByEmployeeId.mockResolvedValue([]);

      await controller.getCurrentEmployeeAttendances(
        mockUser,
        startDate,
        endDate,
      );

      expect(service.findByEmployeeId).toHaveBeenCalledWith(
        mockUser.sub,
        startDate,
        endDate,
      );
    });
  });

  describe('getCurrentEmployeeTodayAttendance', () => {
    it('should get today attendance', async () => {
      const mockAttendance = {
        id: 'attendance-123',
        employeeId: mockUser.sub,
        date: new Date(),
      };

      mockAttendancesService.findTodayAttendance.mockResolvedValue(
        mockAttendance,
      );

      const result =
        await controller.getCurrentEmployeeTodayAttendance(mockUser);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Today attendance retrieved successfully');
      expect(result.data).toEqual(mockAttendance);
      expect(service.findTodayAttendance).toHaveBeenCalledWith(mockUser.sub);
    });
  });

  describe('getEmployeeAttendances', () => {
    it('should get employee attendances by id', async () => {
      const employeeId = 'employee-456';
      const mockAttendances = [
        {
          id: 'attendance-1',
          employeeId,
          date: new Date(),
        },
      ];

      mockAttendancesService.findByEmployeeId.mockResolvedValue(
        mockAttendances,
      );

      const result = await controller.getEmployeeAttendances(employeeId);

      expect(result.success).toBe(true);
      expect(result.message).toBe(
        'Employee attendances retrieved successfully',
      );
      expect(result.data).toEqual(mockAttendances);
      expect(service.findByEmployeeId).toHaveBeenCalledWith(
        employeeId,
        undefined,
        undefined,
      );
    });
  });

  describe('getAllAttendances', () => {
    it('should get all attendances', async () => {
      const mockAttendances = [
        {
          id: 'attendance-1',
          employeeId: 'emp-1',
          date: new Date(),
        },
      ];

      mockAttendancesService.findAll.mockResolvedValue(mockAttendances);

      const result = await controller.getAllAttendances();

      expect(result.success).toBe(true);
      expect(result.message).toBe('All attendances retrieved successfully');
      expect(result.data).toEqual(mockAttendances);
      expect(service.findAll).toHaveBeenCalledWith(
        undefined,
        undefined,
        undefined,
      );
    });

    it('should get attendances with filters', async () => {
      const startDate = '2024-01-01';
      const endDate = '2024-01-31';
      const employeeId = 'employee-123';

      mockAttendancesService.findAll.mockResolvedValue([]);

      await controller.getAllAttendances(startDate, endDate, employeeId);

      expect(service.findAll).toHaveBeenCalledWith(
        startDate,
        endDate,
        employeeId,
      );
    });
  });

  describe('update', () => {
    it('should update attendance', async () => {
      const id = 'attendance-123';
      const updateDto = {
        employeeId: 'employee-123',
        date: new Date().toISOString(),
        checkIn: new Date().toISOString(),
        checkOut: new Date().toISOString(),
        workMode: WorkMode.WFH,
      };

      const mockUpdatedAttendance = {
        id,
        ...updateDto,
      };

      mockAttendancesService.update.mockResolvedValue(mockUpdatedAttendance);

      const result = await controller.update(id, updateDto);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Attendance updated successfully');
      expect(result.data).toEqual(mockUpdatedAttendance);
      expect(service.update).toHaveBeenCalledWith(id, updateDto);
    });
  });

  describe('remove', () => {
    it('should delete attendance', async () => {
      const id = 'attendance-123';

      mockAttendancesService.remove.mockResolvedValue({ id });

      const result = await controller.remove(id);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Attendance deleted successfully');
      expect(result.data).toBeNull();
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });
});
