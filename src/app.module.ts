import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { EmployeesModule } from './employees/employees.module';
import { AttendancesModule } from './attendances/attendances.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [AuthModule, EmployeesModule, AttendancesModule, UploadModule],
})
export class AppModule {}
