import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtUser } from './types/jwt-user.type';
import { PrismaService } from 'src/prisma.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async validatePassword(password: string, hash: string): Promise<void> {
    const valid = await bcrypt.compare(password, hash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
  }

  signToken(payload: JwtUser): string {
    return this.jwtService.sign(payload);
  }

  async login(dto: LoginDto) {
    try {
      const employee = await this.prisma.employee.findUniqueOrThrow({
        where: { email: dto.email },
        include: {
          roles: { include: { role: true } },
        },
      });

      await this.validatePassword(dto.password, employee.password);

      return employee;
    } catch {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
