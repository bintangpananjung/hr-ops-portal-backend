import { PrismaClient } from '../src/generated/prisma';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  const superAdminRole = await prisma.role.upsert({
    where: { name: 'SUPERADMIN' },
    update: {},
    create: {
      name: 'SUPERADMIN',
    },
  });

  const hrRole = await prisma.role.upsert({
    where: { name: 'HR' },
    update: {},
    create: {
      name: 'HR',
    },
  });

  const employeeRole = await prisma.role.upsert({
    where: { name: 'EMPLOYEE' },
    update: {},
    create: {
      name: 'EMPLOYEE',
    },
  });

  console.log('Roles created:', { superAdminRole, hrRole, employeeRole });

  const hashedPassword = await bcrypt.hash('password123', 10);

  const superAdmin = await prisma.employee.upsert({
    where: { employeeId: 'SUPER001' },
    update: {},
    create: {
      employeeId: 'SUPER001',
      name: 'Super Admin',
      email: 'superadmin@hrops.com',
      password: hashedPassword,
      phone: '+1234567890',
      department: 'IT',
      position: 'System Administrator',
      status: 'ACTIVE',
    },
  });

  const hrEmployee = await prisma.employee.upsert({
    where: { employeeId: 'HR001' },
    update: {},
    create: {
      employeeId: 'HR001',
      name: 'HR Manager',
      email: 'hr@hrops.com',
      password: hashedPassword,
      phone: '+1234567891',
      department: 'Human Resources',
      position: 'HR Manager',
      status: 'ACTIVE',
    },
  });

  const regularEmployee = await prisma.employee.upsert({
    where: { employeeId: 'REG001' },
    update: {},
    create: {
      employeeId: 'REG001',
      name: 'Regular Employee',
      email: 'regular@employee.com',
      password: hashedPassword,
      phone: '+1234567891',
      department: 'Human Resources',
      position: 'HR Manager',
      status: 'ACTIVE',
    },
  });

  console.log('Employees created:', {
    superAdmin,
    hrEmployee,
    regularEmployee,
  });

  await prisma.employeeRole.upsert({
    where: {
      employeeId_roleId: {
        employeeId: superAdmin.id,
        roleId: superAdminRole.id,
      },
    },
    update: {},
    create: {
      employeeId: superAdmin.id,
      roleId: superAdminRole.id,
    },
  });

  await prisma.employeeRole.upsert({
    where: {
      employeeId_roleId: {
        employeeId: hrEmployee.id,
        roleId: hrRole.id,
      },
    },
    update: {},
    create: {
      employeeId: hrEmployee.id,
      roleId: hrRole.id,
    },
  });

  console.log('Roles assigned to employees');
  console.log('\n=== Seed Data Summary ===');
  console.log('SuperAdmin Account:');
  console.log('  Employee ID: SUPER001');
  console.log('  Email: superadmin@hrops.com');
  console.log('  Password: password123');
  console.log('\nHR Account:');
  console.log('  Employee ID: HR001');
  console.log('  Email: hr@hrops.com');
  console.log('  Password: password123');
  console.log('\nRegular Employee Account:');
  console.log('  Employee ID: REG001');
  console.log('  Email: regular@employee.com');
  console.log('  Password: password123');
  console.log('========================\n');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
