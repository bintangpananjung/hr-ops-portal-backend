import { EmployeeStatus } from 'src/generated/prisma';

export class CreateEmployeeDto {
  employeeId: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  department?: string;
  position?: string;
  joinDate?: Date;
  status?: EmployeeStatus;
}
